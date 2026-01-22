import { NextRequest } from "next/server";
import { CloudinaryService } from "@/services/cloudinary.service";
import { PropertyService } from "@/services/property.service";
import { ApiResponseService } from "@/services/api-response.service";
import { ValidationService } from "@/services/validation.service";
import { DatabaseService } from "@/services/database.service";
import { addCorsHeaders, handleOptionsRequest } from "@/utils/cors";
import { getAxiomLogger } from "@/lib/axiom";
import { getBaseUrl, publishQStashJob } from "@/lib/qstash";

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
    const period = formData.get("period") as string;
    const description = formData.get("description") as string;
    const images = formData.getAll("images") as File[];

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
      period,
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

      // Log validation error to Axiom via QStash
      const baseUrl = getBaseUrl();
      const errorFields = validation.errors ? Object.keys(validation.errors).join(', ') : 'none';
      
      await publishQStashJob(
        `${baseUrl}/api/background/log-to-axiom`,
        {
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
        },
        'axiom-log-validation-error'
      ).catch((error) => {
        console.error("[QStash] Failed to queue Axiom log:", error);
      });

      const response = ApiResponseService.sendInvalidFields(validation.errors!, {});
      return addCorsHeaders(response, request.headers.get('origin'));
    }

    // Create folder name
    const folder = propertyService.createFolderName(description);

    // Prepare property data
    let propertyData: {
      city: string;
      address: string;
      postcode: string;
      size: string;
      rent: string;
      registration: boolean;
      pets_allowed: boolean;
      smoking_allowed: boolean;
      bills: string | { en: string; bg: string; gr: string };
      flatmates: string | { en: string; bg: string; gr: string };
      period: string | { en: string; bg: string; gr: string };
      description: string | { en: string; bg: string; gr: string };
      folder?: string;
      images?: string;
      title?: string | { en: string; bg: string; gr: string };
      payment_link?: string | null;
    } = {
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
      period,
      description,
      folder,
    };

    // Modify property data with translations
    propertyData =
      propertyService.modifyPropertyDataWithTranslations(propertyData);

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
        propertyData,
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

      // Send notification via QStash (fire-and-forget)
      const baseUrl = getBaseUrl();
      const notificationUrl = `${baseUrl}/api/background/send-notification`;
      
      console.log('[Submit Room Listing] Attempting to queue notification', {
        baseUrl,
        notificationUrl,
        hasQStashToken: !!process.env.QSTASH_TOKEN,
        APP_ENV: process.env.APP_ENV,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
      });
      
      const qstashResult = await publishQStashJob(
        notificationUrl,
        {
          type: "room_listing",
          data: {
            propertyId: createdProperty.id,
            city: city || 'N/A',
            address: address || 'N/A',
            name,
            surname,
            email,
            phone,
          },
        },
        'send-notification-room-listing'
      ).catch((error) => {
        console.error("[QStash] Failed to queue notification:", error);
        return { queued: false, executedSynchronously: false };
      });
      
      console.log('[Submit Room Listing] QStash result', {
        queued: qstashResult?.queued,
        messageId: qstashResult && 'messageId' in qstashResult ? qstashResult.messageId : undefined,
        executedSynchronously: qstashResult?.executedSynchronously,
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

      // Log success to Axiom via QStash (fire-and-forget)
      await publishQStashJob(
        `${baseUrl}/api/background/log-to-axiom`,
        responseData,
        'axiom-log-success'
      ).catch((error) => {
        console.error("[QStash] Failed to queue Axiom log:", error);
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

      // Log error to Axiom via QStash
      const baseUrl = getBaseUrl();
      
      await publishQStashJob(
        `${baseUrl}/api/background/log-to-axiom`,
        {
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
        },
        'axiom-log-property-error'
      ).catch((error) => {
        console.error("[QStash] Failed to queue Axiom log:", error);
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

      console.error("Property creation error:", error);
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

    // Log API error to Axiom via QStash
    const baseUrl = getBaseUrl();
    
    await publishQStashJob(
      `${baseUrl}/api/background/log-to-axiom`,
      {
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
      },
      'axiom-log-api-error'
    ).catch((error) => {
      console.error("[QStash] Failed to queue Axiom log:", error);
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

    console.error("API error:", error);
    const errorResponse = ApiResponseService.sendError(
      errorMessage,
      "account:authentication.errors.general",
      500
    );
    return addCorsHeaders(errorResponse, request.headers.get('origin'));
  }
}
