// Minimal DB types — rebuilt from schema + theme_dark migration
// Run 'npx supabase db push' + 'npm run types:supabase' when Supabase CLI is available

export type Json = string | number | boolean | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          country_code: string | null;
          currency: string | null;
          distance_unit: string | null;
          volume_unit: string | null;
          preferences: Json | null;
          subscription_tier: string | null;
          subscription_expires_at: string | null;
          theme_dark: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          country_code?: string | null;
          currency?: string | null;
          distance_unit?: string | null;
          volume_unit?: string | null;
          preferences?: Json | null;
          subscription_tier?: string | null;
          subscription_expires_at?: string | null;
          theme_dark?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          full_name: string | null;
          avatar_url: string | null;
          country_code: string | null;
          currency: string | null;
          distance_unit: string | null;
          volume_unit: string | null;
          preferences: Json | null;
          subscription_tier: string | null;
          subscription_expires_at: string | null;
          theme_dark: boolean | null;
          updated_at: string;
        }>;
        Relationships: [];
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          make: string;
          model: string;
          year: number | null;
          variant: string | null;
          vehicle_type: string | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          make: string;
          model: string;
          year?: number | null;
          variant?: string | null;
          vehicle_type?: string | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          name: string;
          make: string;
          model: string;
          year: number | null;
          variant: string | null;
          vehicle_type: string | null;
          photo_url: string | null;
          updated_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: 'vehicles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      fuel_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          date: string;
          odometer: number;
          liters: number;
          cost: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          date: string;
          odometer: number;
          liters: number;
          cost: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          date: string;
          odometer: number;
          liters: number;
          cost: number;
          notes: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: 'fuel_logs_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          }
        ];
      };
      service_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          user_id: string;
          service_type: string;
          date: string;
          odometer: number;
          cost: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          user_id: string;
          service_type: string;
          date: string;
          odometer: number;
          cost: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          service_type: string;
          date: string;
          odometer: number;
          cost: number;
          notes: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: 'service_logs_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
  };
}
