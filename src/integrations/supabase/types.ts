export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          additional_fees: number | null
          booking_date: string
          booking_number: string
          booking_time: string
          business_id: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          duration_minutes: number | null
          follow_up_sent_at: string | null
          guest_count: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          reminder_sent_at: string | null
          service_id: string | null
          service_price: number | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          additional_fees?: number | null
          booking_date: string
          booking_number?: string
          booking_time: string
          business_id?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          duration_minutes?: number | null
          follow_up_sent_at?: string | null
          guest_count?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          reminder_sent_at?: string | null
          service_id?: string | null
          service_price?: number | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          additional_fees?: number | null
          booking_date?: string
          booking_number?: string
          booking_time?: string
          business_id?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          duration_minutes?: number | null
          follow_up_sent_at?: string | null
          guest_count?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          reminder_sent_at?: string | null
          service_id?: string | null
          service_price?: number | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          business_id: string | null
          close_time: string | null
          created_at: string | null
          day_of_week: number
          id: string
          is_24_hours: boolean | null
          is_closed: boolean | null
          open_time: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          close_time?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          is_24_hours?: boolean | null
          is_closed?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          close_time?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_24_hours?: boolean | null
          is_closed?: boolean | null
          open_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          average_rating: number | null
          booking_count: number | null
          category_id: string | null
          city: string | null
          click_count: number | null
          country: string | null
          cover_image_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          email: string | null
          featured_until: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          keywords: string[] | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          price_range: Database["public"]["Enums"]["price_range_enum"] | null
          published_at: string | null
          region: string | null
          review_count: number | null
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["business_status"] | null
          street_address: string | null
          updated_at: string | null
          verification_date: string | null
          view_count: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          average_rating?: number | null
          booking_count?: number | null
          category_id?: string | null
          city?: string | null
          click_count?: number | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          keywords?: string[] | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price_range?: Database["public"]["Enums"]["price_range_enum"] | null
          published_at?: string | null
          region?: string | null
          review_count?: number | null
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["business_status"] | null
          street_address?: string | null
          updated_at?: string | null
          verification_date?: string | null
          view_count?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          average_rating?: number | null
          booking_count?: number | null
          category_id?: string | null
          city?: string | null
          click_count?: number | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          keywords?: string[] | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price_range?: Database["public"]["Enums"]["price_range_enum"] | null
          published_at?: string | null
          region?: string | null
          review_count?: number | null
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["business_status"] | null
          street_address?: string | null
          updated_at?: string | null
          verification_date?: string | null
          view_count?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          email_sent: boolean | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          push_sent: boolean | null
          read_at: string | null
          sent_at: string | null
          sms_sent: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          push_sent?: boolean | null
          read_at?: string | null
          sent_at?: string | null
          sms_sent?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          push_sent?: boolean | null
          read_at?: string | null
          sent_at?: string | null
          sms_sent?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          business_response: string | null
          business_response_date: string | null
          cleanliness_rating: number | null
          content: string | null
          created_at: string | null
          customer_id: string | null
          helpful_count: number | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          moderation_notes: string | null
          not_helpful_count: number | null
          published_at: string | null
          quality_rating: number | null
          rating: number
          service_rating: number | null
          status: Database["public"]["Enums"]["review_status"] | null
          title: string | null
          updated_at: string | null
          value_rating: number | null
          booking_id: string | null
        }
        Insert: {
          business_id?: string | null
          business_response?: string | null
          business_response_date?: string | null
          cleanliness_rating?: number | null
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          moderation_notes?: string | null
          not_helpful_count?: number | null
          published_at?: string | null
          quality_rating?: number | null
          rating: number
          service_rating?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          updated_at?: string | null
          value_rating?: number | null
          booking_id?: string | null
        }
        Update: {
          business_id?: string | null
          business_response?: string | null
          business_response_date?: string | null
          cleanliness_rating?: number | null
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          moderation_notes?: string | null
          not_helpful_count?: number | null
          published_at?: string | null
          quality_rating?: number | null
          rating?: number
          service_rating?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          title?: string | null
          updated_at?: string | null
          value_rating?: number | null
          booking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          business_id: string | null
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          max_advance_booking_days: number | null
          min_advance_booking_hours: number | null
          name: string
          price: number | null
          requires_booking: boolean | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          max_advance_booking_days?: number | null
          min_advance_booking_hours?: number | null
          name: string
          price?: number | null
          requires_booking?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          max_advance_booking_days?: number | null
          min_advance_booking_hours?: number | null
          name?: string
          price?: number | null
          requires_booking?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          first_name: string
          gender: string | null
          id: string
          is_active: boolean | null
          is_suspended: boolean | null
          last_login_at: string | null
          last_name: string
          location_city: string | null
          location_region: string | null
          marketing_consent: boolean | null
          metadata: Json | null
          password_hash: string | null
          phone: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          suspension_reason: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          first_name: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          is_suspended?: boolean | null
          last_login_at?: string | null
          last_name: string
          location_city?: string | null
          location_region?: string | null
          marketing_consent?: boolean | null
          metadata?: Json | null
          password_hash?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          is_suspended?: boolean | null
          last_login_at?: string | null
          last_name?: string
          location_city?: string | null
          location_region?: string | null
          marketing_consent?: boolean | null
          metadata?: Json | null
          password_hash?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_business: {
        Args: {
          business_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      business_status: "pending" | "active" | "suspended" | "closed"
      image_type_enum: "logo" | "cover" | "gallery" | "menu" | "certificate"
      notification_type:
        | "booking_confirmed"
        | "booking_cancelled"
        | "booking_reminder"
        | "review_received"
        | "review_response"
        | "business_approved"
        | "payment_received"
        | "system_announcement"
        | "marketing"
      payment_method_enum: "card" | "mobile_money" | "bank_transfer" | "cash"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      price_range_enum: "budget" | "moderate" | "expensive" | "luxury"
      review_status: "pending" | "approved" | "rejected" | "flagged"
      user_role: "customer" | "business_owner" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
