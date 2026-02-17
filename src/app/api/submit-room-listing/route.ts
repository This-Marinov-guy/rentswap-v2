import { NextRequest } from "next/server";
import { CloudinaryService } from "@/services/cloudinary.service";
import { PropertyService } from "@/services/property.service";
import { ApiResponseService } from "@/services/api-response.service";
import { ValidationService } from "@/services/validation.service";
import { DatabaseService } from "@/services/database.service";
import { NotificationService } from "@/services/notification.service";
import { addCorsHeaders, handleOptionsRequest } from "@/utils/cors";
import { getAxiomLogger, logToAxiom } from "@/lib/axiom";

export async function OPTIONS() {
  return handleOptionsRequest();
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const logger = getAxiomLogger();
  const requestId = crypto.randomUUID();

  try {
    // Initialize services
    const cloudinaryService = new CloudinaryService();
    const propertyService = new PropertyService();
    const databaseService = new DatabaseService();

    // Parse form data
    const formData = await request.formData();

    // Log request start
    if (logger) {
      logger.info('Room listing API request started', {
        requestId,
        endpoint: '/api/submit-room-listing',
        method: 'POST',
        timestamp: new Date().toISOString(),
        type: 'room_listing_request',
      });
    }

    // Extract form fields
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const postcode = formData.get("postcode") as string;
    const size = formData.get("size") as string;
    const rent = formData.get("rent") as string;
    const registration = formData.get("registration") === "true";
    const pets_allowed = formData.get("pets_allowed") === "true";
    const smoking_allowed = formData.get("smoking_allowed") === "true";
    const bills = formData.get("bills") as string;
    const flatmates = formData.get("flatmates") as string;
    const periodForm = formData.get("period") as string | null;
    const description = formData.get("description") as string;
    const title = (formData.get("title") as string) || null;
    const images = formData.getAll("images") as File[];
    const type = parseInt(formData.get("type") as string, 10) || null;
    const furnished_type = parseInt(formData.get("furnished_type") as string, 10) || null;
    const bathrooms = parseInt(formData.get("bathrooms") as string, 10) ?? null;
    const toilets = parseInt(formData.get("toilets") as string, 10) ?? null;
    const available_from = (formData.get("available_from") as string) || null;
    const available_to = (formData.get("available_to") as string) || null;
    const amenitiesArr = formData.getAll("amenities[]") as string[];
    const sharedSpaceArr = formData.getAll("shared_space[]") as string[];
    const amenities = amenitiesArr.length ? amenitiesArr.join(",") : null;
    const shared_space = sharedSpaceArr.length ? sharedSpaceArr.join(",") : null;

    const periodForValidation =
      periodForm ||
      (available_from && available_to ? `${available_from} to ${available_to}` : "");

    // Prepare data object for validation
    const data = {
      name,
      surname,
      email,
      phone,
      city,
      address,
      postcode,
      size,
      rent,
      registration,
      pets_allowed,
      smoking_allowed,
      bills,
      flatmates,
      period: periodForValidation,
      description,
      images,
    };

    // Validate data
    const validation = ValidationService.validateRoomListing(data);
    if (!validation.success) {
      // Log validation failure
      if (logger) {
        logger.warn('Room listing validation failed', {
          requestId,
          errors: validation.errors,
          timestamp: new Date().toISOString(),
          type: 'room_listing_validation_error',
        });
      }

      // Log validation error to Axiom
      const errorFields = validation.errors ? Object.keys(validation.errors).join(', ') : 'none';
      
      await logToAxiom({
        requestId,
        endpoint: '/api/submit-room-listing',
        method: 'POST',
        statusCode: 400,
        success: false,
        errorType: 'validation_error',
        errorFields,
        errorCount: validation.errors ? Object.keys(validation.errors).length : 0,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api',
      }).catch(() => {
        // Silently fail - logging is non-critical
      });

      const response = ApiResponseService.sendInvalidFields(validation.errors!, {});
      return addCorsHeaders(response, request.headers.get('origin'));
    }

    // Create folder name
    const folder = propertyService.createFolderName(description);

    // Period: jsonb en only, from available_from and available_to
    const periodEn =
      available_from && available_to
        ? `${available_from} to ${available_to}`
        : periodForm || "";

    // Prepare property data (schema: property_id, city, address, postcode, pets_allowed, smoking_allowed, size, period jsonb en, title, rent int, bills jsonb en, flatmates jsonb en, registration, description, folder, images, payment_link, type, furnished_type, shared_space text, bathrooms, toilets, amenities text, available_from, available_to)
    const propertyData: {
      city: string;
      address: string;
      postcode: string;
      pets_allowed: boolean;
      smoking_allowed: boolean;
      size: string;
      period: { en: string };
      title: string | null;
      rent: number;
      bills: { en: string } | null;
      flatmates: { en: string } | null;
      registration: boolean;
      description: string;
      folder: string;
      images?: string;
      payment_link?: string | null;
      type: number | null;
      furnished_type: number | null;
      shared_space: string | null;
      bathrooms: number | null;
      toilets: number | null;
      amenities: string | null;
      available_from: string | null;
      available_to: string | null;
    } = {
      city,
      address,
      postcode,
      pets_allowed,
      smoking_allowed,
      size,
      period: { en: periodEn },
      title,
      rent: parseInt(rent, 10) || 0,
      bills: bills ? { en: bills } : null,
      flatmates: flatmates ? { en: flatmates } : null,
      registration,
      description,
      folder,
      type,
      furnished_type,
      shared_space,
      bathrooms,
      toilets,
      amenities,
      available_from,
      available_to,
    };

    // Default title when not provided (jsonb en only)
    if (!propertyData.title) {
      propertyData.title = "Available room";
    }
    const titleForDb =
      typeof propertyData.title === "string"
        ? { en: propertyData.title }
        : propertyData.title;

    // Prepare personal data
    const personalData = {
      name,
      surname,
      email,
      phone,
    };

    try {
      const imageUploadStart = Date.now();
      // Upload images
      const uploadedImages = await cloudinaryService.multiUpload(images, {
        folder: `properties/${folder}`,
      });
      propertyData.images = uploadedImages.join(", ");
      const imageUploadDuration = Date.now() - imageUploadStart;

      if (logger) {
        logger.info('Images uploaded successfully', {
          requestId,
          imageCount: images.length,
          uploadedCount: uploadedImages.length,
          duration: imageUploadDuration,
          timestamp: new Date().toISOString(),
          type: 'room_listing_image_upload',
        });
      }

      // Create payment link
      //   const rentAmount = parseFloat(rent) || 0;
      //   if (rentAmount > 0) {
      //     propertyData.payment_link = await paymentLinkService.createPropertyFeeLink(rentAmount);
      //   }

      const dbStart = Date.now();
      // Create property in database
      const createdProperty = await databaseService.createRoomListing(
        { ...propertyData, title: titleForDb },
        personalData
      );
      const dbDuration = Date.now() - dbStart;

      if (logger) {
        logger.info('Property created in database', {
          requestId,
          propertyId: createdProperty.id,
          city,
          duration: dbDuration,
          timestamp: new Date().toISOString(),
          type: 'room_listing_db_create',
        });
      }

      // Send notification directly
      const notificationService = new NotificationService();
      await notificationService.sendNotification(
        "room_listing",
        {
          propertyId: createdProperty.id ?? '-',
          city: city || 'N/A',
          address: address || 'N/A',
          name,
          surname,
          email,
          phone,
        }
      ).catch(() => {
        // Silently fail - notification is non-critical
      });

      const totalDuration = Date.now() - startTime;
      // Simplified response data to avoid Axiom column limit
      const responseData = {
        requestId,
        endpoint: '/api/submit-room-listing',
        method: 'POST',
        statusCode: 200,
        success: true,
        propertyId: createdProperty.id,
        city,
        imageCount: images.length,
        totalDuration,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api',
      };

      // Log success to Axiom
      await logToAxiom(responseData).catch(() => {
        // Silently fail - logging is non-critical
      });

      // Log to logger in background (simplified to avoid Axiom column limit)
      if (logger) {
        logger.info('Room listing created successfully', {
          requestId,
          propertyId: createdProperty.id,
          statusCode: 200,
          success: true,
          timestamp: new Date().toISOString(),
          type: 'room_listing_api',
        });
      }

      const successResponse = ApiResponseService.sendSuccess(
        { propertyId: createdProperty.id },
        "Room listing created successfully",
        "property:create.success"
      );
      return addCorsHeaders(successResponse, request.headers.get('origin'));
    } catch (error: unknown) {
      const totalDuration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create room listing";

      // Log error to Axiom
      await logToAxiom({
        requestId,
        endpoint: '/api/submit-room-listing',
        method: 'POST',
        statusCode: 500,
        success: false,
        errorType: 'property_creation_error',
        error: errorMessage.substring(0, 500), // Limit error message length
        duration: totalDuration,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api',
      }).catch(() => {
        // Silently fail - logging is non-critical
      });

      if (logger) {
        logger.error('Property creation error', {
          requestId,
          error: errorMessage.substring(0, 500), // Limit error message length
          duration: totalDuration,
          timestamp: new Date().toISOString(),
          type: 'room_listing_error',
        });
      }

      const errorResponse = ApiResponseService.sendError(
        errorMessage,
        "property:create.error"
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }
  } catch (error: unknown) {
    const totalDuration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    // Log API error to Axiom
    await logToAxiom({
      requestId,
      endpoint: '/api/submit-room-listing',
      method: 'POST',
      statusCode: 500,
      success: false,
      errorType: 'api_error',
      error: errorMessage.substring(0, 500), // Limit error message length
      duration: totalDuration,
      timestamp: new Date().toISOString(),
      type: 'room_listing_api',
    }).catch(() => {
      // Silently fail - logging is non-critical
    });

    if (logger) {
      logger.error('API error', {
        requestId,
        error: errorMessage.substring(0, 500), // Limit error message length
        duration: totalDuration,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api_error',
      });
    }

    const errorResponse = ApiResponseService.sendError(
      errorMessage,
      "account:authentication.errors.general",
      500
    );
    return addCorsHeaders(errorResponse, request.headers.get('origin'));
  }
}
