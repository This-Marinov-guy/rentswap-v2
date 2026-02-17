import { createClient } from '@supabase/supabase-js';

interface PropertyData {
  property_id?: string;
  city: string;
  address: string;
  postcode: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  size: string;
  period: { en: string };
  title: string | { en: string } | null;
  rent: number;
  bills: { en: string } | null;
  flatmates: { en: string } | null;
  registration: boolean;
  description: { en: string } | null;
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
}

interface PersonalData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}
export class DatabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Use service role key if available, otherwise fall back to anon key (may have RLS restrictions)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️  WARNING: Using NEXT_PUBLIC_SUPABASE_ANON_KEY instead of SUPABASE_SERVICE_ROLE_KEY.');
      console.warn('⚠️  Database operations may fail due to Row Level Security (RLS) policies.');
      console.warn('⚠️  Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local file for server-side operations.');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createRoomListing(propertyData: PropertyData, personalData: PersonalData) {
    try {
      // Step 1: Create the property record first
      const { data: property, error: propertyError } = await this.supabase
        .from('properties')
        .insert([
          {
            interface: 'rentswap',
          },
        ])
        .select()
        .single();

      if (propertyError) {
        throw new Error(`Database error creating property: ${propertyError.message}`);
      }

      if (!property || !property.id) {
        throw new Error('Failed to create property: No ID returned');
      }

      const propertyId = property.id;

      // Step 2: Create personal_data record with foreign key to property
      const { data: personalDataRecord, error: personalDataError } = await this.supabase
        .from('personal_data')
        .insert([
          {
            property_id: propertyId,
            name: personalData.name,
            surname: personalData.surname,
            email: personalData.email,
            phone: personalData.phone,
          },
        ])
        .select()
        .single();

      if (personalDataError) {
        // Rollback: delete the property if personal_data creation fails
        await this.supabase.from('properties').delete().eq('id', propertyId);
        throw new Error(`Database error creating personal_data: ${personalDataError.message}`);
      }

      // Step 3: Create property_data record with foreign key to property
      const { data: propertyDataRecord, error: propertyDataError } = await this.supabase
        .from('property_data')
        .insert([
          {
            property_id: propertyId,
            city: propertyData.city,
            address: propertyData.address,
            postcode: propertyData.postcode || null,
            pets_allowed: propertyData.pets_allowed,
            smoking_allowed: propertyData.smoking_allowed,
            size: propertyData.size,
            period: propertyData.period || null,
            title: propertyData.title ?? null,
            rent: propertyData.rent,
            bills: propertyData.bills || null,
            flatmates: propertyData.flatmates || null,
            registration: propertyData.registration,
            description: propertyData.description,
            folder: propertyData.folder || null,
            images: propertyData.images || null,
            payment_link: propertyData.payment_link || null,
            type: propertyData.type,
            furnished_type: propertyData.furnished_type,
            shared_space: propertyData.shared_space,
            bathrooms: propertyData.bathrooms,
            toilets: propertyData.toilets,
            amenities: propertyData.amenities,
            available_from: propertyData.available_from,
            available_to: propertyData.available_to,
          },
        ])
        .select()
        .single();

      if (propertyDataError) {
        // Rollback: delete the property and personal_data if property_data creation fails
        await this.supabase.from('personal_data').delete().eq('property_id', propertyId);
        await this.supabase.from('properties').delete().eq('id', propertyId);
        throw new Error(`Database error creating property_data: ${propertyDataError.message}`);
      }

      // Return the property with related data
      return {
        ...property,
        personal_data: personalDataRecord,
        property_data: propertyDataRecord,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create room listing';
      throw new Error(errorMessage);
    }
  }
}

