import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { ValidationService } from "@/services/validation.service";
import { addCorsHeaders, handleOptionsRequest } from "@/utils/cors";
import { getBaseUrl, publishQStashJob } from "@/lib/qstash";

// Configure Cloudinary from CLOUDINARY_URL env var
// Format: cloudinary://api_key:api_secret@cloud_name
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
  try {
    const urlParts = cloudinaryUrl.replace("cloudinary://", "").split("@");
    const credentials = urlParts[0].split(":");
    cloudinary.config({
      cloud_name: urlParts[1],
      api_key: credentials[0],
      api_secret: credentials[1],
    });
  } catch (configError) {
    console.error("Cloudinary configuration error:", configError);
  }
}

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use service role key if available, otherwise fall back to anon key (may have RLS restrictions)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("⚠️  WARNING: Using NEXT_PUBLIC_SUPABASE_ANON_KEY instead of SUPABASE_SERVICE_ROLE_KEY.");
  console.warn("⚠️  Database operations may fail due to Row Level Security (RLS) policies.");
  console.warn("⚠️  Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local file for server-side operations.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DatabaseFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  type: string;
  city: string;
  budget: number;
  move_in: string; // Date in YYYY-MM-DD format for database date type
  period: string;
  registration: string;
  people: number;
  letter?: string; // Optional - Cloudinary URL
  note?: string; // Optional - note to agent
  referral_code?: string; // Optional
  interface: string; // Should be "rentswap"
}

export async function OPTIONS() {
  return handleOptionsRequest();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const accommodationType = formData.get("accommodationType") as string; // "Any", "Shared", "Private"
    const city = formData.get("city") as string;
    const budget = formData.get("budget") as string;
    const move_in = formData.get("move_in") as string;
    const period = formData.get("period") as string;
    const registration = formData.get("registration") as string;
    const people = formData.get("people") as string;
    const note = formData.get("note") as string | null;
    const referral_code = formData.get("referral_code") as string | null;
    const coverLetterFile = formData.get("letter") as File | null;

    // Prepare data object for validation
    const validationData = {
      name,
      surname,
      email,
      phone,
      type: accommodationType || "Any", // Use accommodationType for validation
      city,
      budget,
      move_in,
      period,
      registration,
      people,
      letter: coverLetterFile || undefined,
      note: note || undefined,
      referral_code: referral_code || undefined,
    };

    // Validate data using ValidationService
    const validation = ValidationService.validateRoomSearching(validationData);
    if (!validation.success) {
      // Convert errors from array format to single message format for compatibility
      const formattedErrors: Record<string, string> = {};
      if (validation.errors) {
        for (const [key, messages] of Object.entries(validation.errors)) {
          formattedErrors[key] = messages[0]; // Take first error message
        }
      }
      const errorResponse = NextResponse.json(
        { success: false, errors: formattedErrors },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }

    // Upload cover letter to Cloudinary if provided
    let letterUrl: string | null = null;
    if (coverLetterFile && coverLetterFile.size > 0) {
      // Validate file size (3MB = 3 * 1024 * 1024 bytes)
      const maxSize = 3 * 1024 * 1024;
      if (coverLetterFile.size > maxSize) {
        const errorResponse = NextResponse.json(
          {
            success: false,
            errors: {
              coverLetter: "File size must be less than 3MB",
            },
          },
          { status: 400 }
        );
        return addCorsHeaders(errorResponse, request.headers.get('origin'));
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      const fileName = coverLetterFile.name.toLowerCase();
      const isValidType =
        allowedTypes.includes(coverLetterFile.type) ||
        allowedExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValidType) {
        const errorResponse = NextResponse.json(
          {
            success: false,
            errors: {
              coverLetter: "Only PDF and DOC files are allowed",
            },
          },
          { status: 400 }
        );
        return addCorsHeaders(errorResponse, request.headers.get('origin'));
      }

      // Check if Cloudinary is configured
      if (!cloudinaryUrl) {
        const errorResponse = NextResponse.json(
          {
            success: false,
            errors: {
              coverLetter: "File upload service is not configured. Please contact support.",
            },
          },
          { status: 500 }
        );
        return addCorsHeaders(errorResponse, request.headers.get('origin'));
      }

      try {
        const arrayBuffer = await coverLetterFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "rentswap/cover-letters",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else if (result) {
                resolve(result);
              } else {
                reject(new Error("Upload failed: No result returned"));
              }
            }
          );
          uploadStream.end(buffer);
        });

        letterUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        const errorResponse = NextResponse.json(
          {
            success: false,
            errors: {
              coverLetter: uploadError instanceof Error 
                ? `Failed to upload cover letter: ${uploadError.message}`
                : "Failed to upload cover letter. Please try again.",
            },
          },
          { status: 500 }
        );
        return addCorsHeaders(errorResponse, request.headers.get('origin'));
      }
    }

    // Prepare data for database insertion
    // Validate and format move_in as date (YYYY-MM-DD format for Supabase date type)
    const moveInDateString = move_in.trim();
    if (!moveInDateString) {
      const errorResponse = NextResponse.json(
        {
          success: false,
          errors: {
            move_in: "Move-in date is required",
          },
        },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }

    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(moveInDateString)) {
      const errorResponse = NextResponse.json(
        {
          success: false,
          errors: {
            move_in: "Invalid date format. Expected YYYY-MM-DD",
          },
        },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }

    // Validate it's a valid date
    const moveInDate = new Date(moveInDateString + 'T00:00:00');
    if (isNaN(moveInDate.getTime())) {
      const errorResponse = NextResponse.json(
        {
          success: false,
          errors: {
            move_in: "Invalid date value",
          },
        },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }

    const dbData: DatabaseFormData = {
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      type: (accommodationType || "Any").trim(), // Save accommodationType to the type column
      city: city.trim(),
      budget: parseInt(budget, 10),
      move_in: moveInDateString, // Keep as YYYY-MM-DD string - Supabase date columns accept this format
      period: period.trim(),
      registration: registration.trim(),
      people: parseInt(people, 10),
      interface: "rentswap",
      ...(letterUrl && { letter: letterUrl }),
      ...(note?.trim() && { note: note.trim() }),
      ...(referral_code?.trim() && { referral_code: referral_code.trim() }),
    };

    // Insert into Supabase
    console.log("Inserting data into database:", JSON.stringify(dbData, null, 2));
    const { data, error: dbError } = await supabase
      .from("search_rentings")
      .insert([dbData])
      .select();

    if (dbError) {
      // Log detailed error information
      const errorDetails = {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code,
      };
      console.error("Database error details:", errorDetails);
      console.error("Full error object:", dbError);
      console.error("Data being inserted:", dbData);
      
      // Provide more helpful error message
      let errorMessage = "Failed to save your information. Please try again.";
      if (dbError.message) {
        errorMessage = dbError.message;
      } else if (dbError.code === "42501") {
        errorMessage = "Permission denied. Please check your database permissions.";
      } else if (dbError.code === "42P01") {
        errorMessage = "Table 'rental_searches' does not exist. Please check your database schema.";
      } else if (dbError.code === "23505") {
        errorMessage = "A record with this information already exists.";
      }
      
      const errorResponse = NextResponse.json(
        {
          success: false,
          errors: {
            general: errorMessage,
          },
        },
        { status: 500 }
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }

    // Send email notification via QStash (fire-and-forget)
    const baseUrl = getBaseUrl();
    const notificationUrl = `${baseUrl}/api/background/send-notification`;
    
    await publishQStashJob(
      notificationUrl,
      {
        type: "room_searching",
        data: {
          name,
          surname,
          email,
          phone,
          city,
          budget,
          move_in,
          period,
          registration: registration || undefined,
          accommodationType: accommodationType || undefined,
          peopleToAccommodate: people || undefined,
        },
      }
    ).catch(() => {
      // Silently fail - notification is non-critical
    });

    const successResponse = NextResponse.json(
      {
        success: true,
        message: "Your information has been submitted successfully!",
        data,
      },
      { status: 200 }
    );
    return addCorsHeaders(successResponse, request.headers.get('origin'));
  } catch (error) {
    console.error("Form submission error:", error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        errors: {
          general:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again.",
        },
      },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, request.headers.get('origin'));
  }
}

