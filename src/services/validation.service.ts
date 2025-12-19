import { z } from 'zod';

export const roomListingValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').refine((val) => val.replace(/\D/g, '').length >= 5, {
    message: 'Invalid phone',
  }),
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

export const roomSearchingValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').refine((val) => val.replace(/\D/g, '').length >= 5, {
    message: 'Invalid phone',
  }),
  type: z.string().min(1, 'Type is required'),
  city: z.string().min(1, 'City is required'),
  budget: z.string().min(1, 'Budget is required'),
  move_in: z.string().min(1, 'Move in date is required'),
  period: z.string().min(1, 'Period is required'),
  registration: z.string().min(1, 'Registration is required'),
  people: z.string().min(1, 'People is required'),
  letter: z.instanceof(File).optional(),
  note: z.string().optional(),
  referral_code: z.string().optional(),
});

export type RoomSearchingFormData = z.infer<typeof roomSearchingValidationSchema>;

export class ValidationService {
  static validateRoomListing(data: any): { success: boolean; errors?: Record<string, string[]> } {
    const result = roomListingValidationSchema.safeParse(data);
    
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const error of result.error.issues) {
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

  static validateRoomSearching(data: any): { success: boolean; errors?: Record<string, string[]> } {
    const result = roomSearchingValidationSchema.safeParse(data);
    
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const error of result.error.issues) {
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

