import { z } from 'zod';

export const roomListingValidationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  size: z.string().min(1, 'Size is required'),
  rent: z.string().min(1, 'Rent is required'),
  registration: z.boolean(),
  pets_allowed: z.boolean(),
  smoking_allowed: z.boolean(),
  bills: z.string().min(1, 'Bills is required'),
  flatmates: z.string().min(1, 'Flatmates is required'),
  period: z.string().min(1, 'Period is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.instanceof(File)).min(3, 'At least 3 images are required').max(10, 'Maximum 10 images allowed'),
});

export type RoomListingFormData = z.infer<typeof roomListingValidationSchema>;

export class ValidationService {
  static validateRoomListing(data: any): { success: boolean; errors?: Record<string, string[]> } {
    const result = roomListingValidationSchema.safeParse(data);
    
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const error of result.error.errors) {
        const path = error.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(error.message);
      }
      return { success: false, errors };
    }
    
    return { success: true };
  }
}

