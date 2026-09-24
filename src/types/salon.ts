import type { HairAddonPriceRow, HairTypeRecommendations } from "@/types/database";

export type TemplateId = "luxury-black-gold" | "soft-editorial" | "bold-afro";

export interface SalonTheme {
  id: TemplateId;
  name: string;
  colors: {
    primary: string;
    accent: string;
    accentLight: string;
    surface: string;
    muted: string;
  };
}

export interface SalonService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  durationMinutes?: number;
  deposit?: number;
  requiresHairAddon?: boolean;
  hairAddonPricing?: HairAddonPriceRow[];
  hairTypeRecommendations?: HairTypeRecommendations;
  isExtensionService?: boolean;
}

export interface SalonReview {
  id: string;
  /** Optional; real client reviews stay anonymous (no name shown). */
  author?: string;
  rating: number;
  text: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  label?: string;
}

export interface SalonFAQ {
  question: string;
  answer: string;
}

export interface SalonProfile {
  id?: string;
  slug: string;
  templateId: TemplateId;
  businessName: string;
  tagline: string;
  city: string;
  bio: string;
  heroImage: string;
  logoUrl?: string | null;
  logoInitials: string;
  email: string;
  phone: string;
  instagram: string;
  address: string;
  hairTypePhotos?: Record<string, string>;
  services: SalonService[];
  gallery: GalleryItem[];
  reviews: SalonReview[];
  faqs: SalonFAQ[];
  policies: {
    deposit: string;
    cancellation: string;
    aftercare: string;
  };
  /** Quiet public-page line when loyalty is enabled; omit when disabled. */
  loyaltyNote?: string | null;
}
