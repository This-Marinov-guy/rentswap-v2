import { createClient } from '@supabase/supabase-js';

interface PropertyData {
  city: string;
  address: string;
  postcode: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  size: string;
  period: string;
  rent: string;
  bills: string;
  flatmates: string;
  registration: boolean;
  description: string;
  title?: string;
  folder?: string;
  images?: string;
  payment_link?: string | null;
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

  async createRoomListing(propertyData: PropertyData) {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .insert([
          {
            city: propertyData.city,
            address: propertyData.address,
            postcode: propertyData.postcode || null,
            pets_allowed: propertyData.pets_allowed,
            smoking_allowed: propertyData.smoking_allowed,
            size: propertyData.size,
            period: propertyData.period || null,
            rent: parseFloat(propertyData.rent) || 0,
            bills: propertyData.bills || null,
            flatmates: propertyData.flatmates || null,
            registration: propertyData.registration,
            description: propertyData.description,
            title: propertyData.title || null,
            folder: propertyData.folder || null,
            images: propertyData.images || null,
            payment_link: propertyData.payment_link || null,
            interface: 'rentswap',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      throw new Error(`Failed to create room listing: ${error.message}`);
    }
  }
}

