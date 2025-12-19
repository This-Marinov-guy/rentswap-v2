import { NextRequest } from "next/server";
import { CloudinaryService } from "@/services/cloudinary.service";
import { PropertyService } from "@/services/property.service";
import { NotificationService } from "@/services/notification.service";
import { ApiResponseService } from "@/services/api-response.service";
import { ValidationService } from "@/services/validation.service";
import { DatabaseService } from "@/services/database.service";
import { addCorsHeaders, handleOptionsRequest } from "@/utils/cors";
import { logToAxiom, getAxiomLogger } from "@/lib/axiom";

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
    const notificationService = new NotificationService();
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

      await logToAxiom({
        requestId,
        endpoint: '/api/submit-room-listing',
        method: 'POST',
        statusCode: 400,
        success: false,
        errorType: 'validation_error',
        errors: validation.errors,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api',
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
      bills: string;
      flatmates: string;
      period: string;
      description: string;
      folder?: string;
      images?: string;
      title?: string;
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
          folder: `properties/${folder}`,
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
          address,
          duration: dbDuration,
          timestamp: new Date().toISOString(),
          type: 'room_listing_db_create',
        });
      }

      // Send notifications (non-blocking but with better error handling)
      const notificationStart = Date.now();
      notificationService
        .sendNotification("room_listing", {
          propertyId: createdProperty.id,
          city: city || 'N/A',
          address: address || 'N/A',
          name,
          surname,
          email,
          phone,
        })
        .then(() => {
          const notificationDuration = Date.now() - notificationStart;
          console.log("[Room Listing API] Notification sent successfully");
          
          if (logger) {
            logger.info('Notification sent successfully', {
              requestId,
              propertyId: createdProperty.id,
              duration: notificationDuration,
              timestamp: new Date().toISOString(),
              type: 'room_listing_notification',
            });
          }
        })
        .catch((error) => {
          const notificationDuration = Date.now() - notificationStart;
          console.error("[Room Listing API] Notification error:", error);
          
          if (logger) {
            logger.error('Notification failed', {
              requestId,
              propertyId: createdProperty.id,
              error: error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined,
              duration: notificationDuration,
              timestamp: new Date().toISOString(),
              type: 'room_listing_notification_error',
            });
          }

          if (error instanceof Error) {
            console.error("[Room Listing API] Error details:", {
              message: error.message,
              stack: error.stack,
            });
          }
        });

      const totalDuration = Date.now() - startTime;
      const responseData = {
        requestId,
        endpoint: '/api/submit-room-listing',
        method: 'POST',
        statusCode: 200,
        success: true,
        propertyId: createdProperty.id,
        city,
        address,
        imageCount: images.length,
        imageUploadDuration,
        dbDuration,
        totalDuration,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api',
      };

      // Log success to Axiom
      await logToAxiom(responseData);

      if (logger) {
        logger.info('Room listing created successfully', responseData);
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
        error: errorMessage,
        errorStack: error instanceof Error ? error.stack : undefined,
        duration: totalDuration,
        timestamp: new Date().toISOString(),
        type: 'room_listing_api',
      });

      if (logger) {
        logger.error('Property creation error', {
          requestId,
          error: errorMessage,
          errorStack: error instanceof Error ? error.stack : undefined,
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

    // Log API error to Axiom
    await logToAxiom({
      requestId,
      endpoint: '/api/submit-room-listing',
      method: 'POST',
      statusCode: 500,
      success: false,
      errorType: 'api_error',
      error: errorMessage,
      errorStack: error instanceof Error ? error.stack : undefined,
      duration: totalDuration,
      timestamp: new Date().toISOString(),
      type: 'room_listing_api',
    });

    if (logger) {
      logger.error('API error', {
        requestId,
        error: errorMessage,
        errorStack: error instanceof Error ? error.stack : undefined,
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
