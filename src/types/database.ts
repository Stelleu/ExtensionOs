export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type HairTexture =
  | "straight"
  | "body-wavy"
  | "kinky-curly"
  | "yaki"
  | "kinky";

export interface ConsultationFormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number";
  required?: boolean;
  options?: string[];
}

export interface ConsultationFormSchema {
  title: string;
  serviceType: "extensions" | "wig" | "color" | "general";
  fields: ConsultationFormField[];
}

export interface Business {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  bio: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  template_id: string | null;
  instagram: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  minimum_booking_notice_hours: number;
  cancellation_policy: string;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  base_price: number;
  deposit_amount: number;
  duration_minutes: number;
  requires_hair_addon: boolean;
  is_extension_service: boolean;
  active: boolean;
  consultation_form_schema: ConsultationFormSchema | null;
  created_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  visit_count: number;
  health_notes: string | null;
  health_notes_consent: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  business_id: string;
  client_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  wants_hair_addon: boolean;
  hair_length: string | null;
  hair_texture: HairTexture | null;
  hair_addon_price: number;
  service_price: number;
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  stripe_payment_intent_id: string | null;
  status: BookingStatus;
  maintenance_due_date: string | null;
  maintenance_reminder_sent: boolean;
  created_at: string;
}

export interface Availability {
  id: string;
  business_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface BlockedTime {
  id: string;
  business_id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Partial<Business> & Pick<Business, "name" | "slug">;
        Update: Partial<Business>;
        Relationships: [];
      };
      services: {
        Row: Service;
        Insert: Partial<Service> &
          Pick<
            Service,
            "business_id" | "name" | "base_price" | "deposit_amount"
          >;
        Update: Partial<Service>;
        Relationships: [];
      };
      clients: {
        Row: Client;
        Insert: Partial<Client> & Pick<Client, "business_id" | "name">;
        Update: Partial<Client>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: Partial<Booking> &
          Pick<
            Booking,
            | "business_id"
            | "client_id"
            | "service_id"
            | "appointment_date"
            | "appointment_time"
            | "service_price"
            | "total_price"
            | "deposit_amount"
          >;
        Update: Partial<Booking>;
        Relationships: [];
      };
      availability: {
        Row: Availability;
        Insert: Partial<Availability> &
          Pick<Availability, "business_id" | "day_of_week" | "start_time" | "end_time">;
        Update: Partial<Availability>;
        Relationships: [];
      };
      blocked_times: {
        Row: BlockedTime;
        Insert: Partial<BlockedTime> & Pick<BlockedTime, "business_id" | "date">;
        Update: Partial<BlockedTime>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_available_slots: {
        Args: {
          p_business_id: string;
          p_service_id: string;
          p_date: string;
        };
        Returns: { slot_time: string }[];
      };
    };
    Enums: {
      booking_status: BookingStatus;
      hair_texture: HairTexture;
    };
    CompositeTypes: Record<string, never>;
  };
};
