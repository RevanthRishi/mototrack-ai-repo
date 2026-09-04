export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_diagnostics: {
        Row: {
          content: string
          created_at: string
          estimated_cost_max: number | null
          estimated_cost_min: number | null
          id: string
          probable_causes: string[] | null
          recommendation: string | null
          role: string
          session_id: string
          severity: string | null
          symptoms: string[] | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          estimated_cost_max?: number | null
          estimated_cost_min?: number | null
          id?: string
          probable_causes?: string[] | null
          recommendation?: string | null
          role: string
          session_id: string
          severity?: string | null
          symptoms?: string[] | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          estimated_cost_max?: number | null
          estimated_cost_min?: number | null
          id?: string
          probable_causes?: string[] | null
          recommendation?: string | null
          role?: string
          session_id?: string
          severity?: string | null
          symptoms?: string[] | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_diagnostics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_diagnostics_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          date: string | null
          document_type: string
          expiry_date: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          notes: string | null
          title: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          document_type: string
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          title: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          document_type?: string
          expiry_date?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_logs: {
        Row: {
          cost: number
          created_at: string
          date: string
          distance_since_last: number | null
          fuel_type: string | null
          id: string
          is_full_tank: boolean | null
          location: string | null
          mileage: number | null
          notes: string | null
          odometer: number
          price_per_unit: number | null
          quantity: number
          receipt_url: string | null
          station_name: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          date: string
          distance_since_last?: number | null
          fuel_type?: string | null
          id?: string
          is_full_tank?: boolean | null
          location?: string | null
          mileage?: number | null
          notes?: string | null
          odometer: number
          price_per_unit?: number | null
          quantity: number
          receipt_url?: string | null
          station_name?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          distance_since_last?: number | null
          fuel_type?: string | null
          id?: string
          is_full_tank?: boolean | null
          location?: string | null
          mileage?: number | null
          notes?: string | null
          odometer?: number
          price_per_unit?: number | null
          quantity?: number
          receipt_url?: string | null
          station_name?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          brand: string | null
          cost: number | null
          created_at: string
          expected_lifespan_km: number | null
          expected_lifespan_months: number | null
          id: string
          installation_date: string | null
          installation_odometer: number | null
          notes: string | null
          part_category: string | null
          part_name: string
          part_number: string | null
          purchase_date: string | null
          service_log_id: string | null
          supplier: string | null
          vehicle_id: string
          warranty_expires_at: string | null
        }
        Insert: {
          brand?: string | null
          cost?: number | null
          created_at?: string
          expected_lifespan_km?: number | null
          expected_lifespan_months?: number | null
          id?: string
          installation_date?: string | null
          installation_odometer?: number | null
          notes?: string | null
          part_category?: string | null
          part_name: string
          part_number?: string | null
          purchase_date?: string | null
          service_log_id?: string | null
          supplier?: string | null
          vehicle_id: string
          warranty_expires_at?: string | null
        }
        Update: {
          brand?: string | null
          cost?: number | null
          created_at?: string
          expected_lifespan_km?: number | null
          expected_lifespan_months?: number | null
          id?: string
          installation_date?: string | null
          installation_odometer?: number | null
          notes?: string | null
          part_category?: string | null
          part_name?: string
          part_number?: string | null
          purchase_date?: string | null
          service_log_id?: string | null
          supplier?: string | null
          vehicle_id?: string
          warranty_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parts_service_log_id_fkey"
            columns: ["service_log_id"]
            isOneToOne: false
            referencedRelation: "service_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_recurring: boolean | null
          last_triggered_at: string | null
          notification_sent: boolean | null
          recurrence_km: number | null
          recurrence_months: number | null
          reminder_type: string
          snoozed_until: string | null
          status: string | null
          title: string
          trigger_date: string | null
          trigger_odometer: number | null
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          last_triggered_at?: string | null
          notification_sent?: boolean | null
          recurrence_km?: number | null
          recurrence_months?: number | null
          reminder_type: string
          snoozed_until?: string | null
          status?: string | null
          title: string
          trigger_date?: string | null
          trigger_odometer?: number | null
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          last_triggered_at?: string | null
          notification_sent?: boolean | null
          recurrence_km?: number | null
          recurrence_months?: number | null
          reminder_type?: string
          snoozed_until?: string | null
          status?: string | null
          title?: string
          trigger_date?: string | null
          trigger_odometer?: number | null
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_logs: {
        Row: {
          cost: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          is_diy: boolean | null
          mechanic_name: string | null
          next_service_due_date: string | null
          next_service_due_km: number | null
          notes: string | null
          odometer: number
          parts_replaced: string[] | null
          receipt_url: string | null
          service_center: string | null
          service_type: string
          severity: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_diy?: boolean | null
          mechanic_name?: string | null
          next_service_due_date?: string | null
          next_service_due_km?: number | null
          notes?: string | null
          odometer: number
          parts_replaced?: string[] | null
          receipt_url?: string | null
          service_center?: string | null
          service_type: string
          severity?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_diy?: boolean | null
          mechanic_name?: string | null
          next_service_due_date?: string | null
          next_service_due_km?: number | null
          notes?: string | null
          odometer?: number
          parts_replaced?: string[] | null
          receipt_url?: string | null
          service_center?: string | null
          service_type?: string
          severity?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          country_code: string | null
          created_at: string
          currency: string | null
          distance_unit: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string
          volume_unit: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          currency?: string | null
          distance_unit?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
          volume_unit?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          currency?: string | null
          distance_unit?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
          volume_unit?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          current_odometer: number
          engine_capacity: number | null
          fuel_type: string | null
          id: string
          make: string
          metadata: Json | null
          model: string
          name: string
          photo_url: string | null
          purchase_date: string | null
          purchase_price: number | null
          registration_number: string | null
          status: string | null
          updated_at: string
          user_id: string
          variant: string | null
          vehicle_type: string | null
          vin_number: string | null
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          current_odometer?: number
          engine_capacity?: number | null
          fuel_type?: string | null
          id?: string
          make: string
          metadata?: Json | null
          model: string
          name: string
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_number?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          variant?: string | null
          vehicle_type?: string | null
          vin_number?: string | null
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          current_odometer?: number
          engine_capacity?: number | null
          fuel_type?: string | null
          id?: string
          make?: string
          metadata?: Json | null
          model?: string
          name?: string
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_number?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          variant?: string | null
          vehicle_type?: string | null
          vin_number?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
