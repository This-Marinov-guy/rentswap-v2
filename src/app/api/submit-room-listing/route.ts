import { NextRequest } from "next/server";
import { CloudinaryService } from "@/services/cloudinary.service";
import { PropertyService } from "@/services/property.service";
import { NotificationService } from "@/services/notification.service";
import { ApiResponseService } from "@/services/api-response.service";
import { ValidationService } from "@/services/validation.service";
import { DatabaseService } from "@/services/database.service";
import { addCorsHeaders, handleOptionsRequest } from "@/utils/cors";

export async function OPTIONS() {
  return handleOptionsRequest();
}

export async function POST(request: NextRequest) {
  try {
    // Initialize services
    const cloudinaryService = new CloudinaryService();
    const propertyService = new PropertyService();
    const notificationService = new NotificationService();
    const databaseService = new DatabaseService();

    // Parse form data
    const formData = await request.formData();

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
      // Upload images
      const uploadedImages = await cloudinaryService.multiUpload(images, {
        folder: `properties/${folder}`,
      });
      propertyData.images = uploadedImages.join(", ");

      // Create payment link
      //   const rentAmount = parseFloat(rent) || 0;
      //   if (rentAmount > 0) {
      //     propertyData.payment_link = await paymentLinkService.createPropertyFeeLink(rentAmount);
      //   }

      // Create property in database
      const createdProperty = await databaseService.createRoomListing(
        propertyData,
        personalData
      );

      // Send notifications (non-blocking)
      notificationService
        .sendNotification("room_listing", {
          propertyId: createdProperty.id,
          city,
          address,
          name,
          surname,
          email,
          phone,
        })
        .catch((error) => {
          console.error("Notification error:", error);
        });

      const successResponse = ApiResponseService.sendSuccess(
        { propertyId: createdProperty.id },
        "Room listing created successfully",
        "property:create.success"
      );
      return addCorsHeaders(successResponse, request.headers.get('origin'));
    } catch (error: unknown) {
      console.error("Property creation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create room listing";
      const errorResponse = ApiResponseService.sendError(
        errorMessage,
        "property:create.error"
      );
      return addCorsHeaders(errorResponse, request.headers.get('origin'));
    }
  } catch (error: unknown) {
    console.error("API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const errorResponse = ApiResponseService.sendError(
      errorMessage,
      "account:authentication.errors.general",
      500
    );
    return addCorsHeaders(errorResponse, request.headers.get('origin'));
  }
}
