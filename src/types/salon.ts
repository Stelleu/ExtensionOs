export type TemplateId = "luxury-black-gold" | "beige-minimal" | "glam-pink";

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
  deposit?: number;
}

export interface SalonReview {
  id: string;
  author: string;
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
  slug: string;
  templateId: TemplateId;
  businessName: string;
  tagline: string;
  city: string;
  bio: string;
  heroImage: string;
  logoInitials: string;
  email: string;
  phone: string;
  instagram: string;
  address: string;
  services: SalonService[];
  gallery: GalleryItem[];
  reviews: SalonReview[];
  faqs: SalonFAQ[];
  policies: {
    deposit: string;
    cancellation: string;
    aftercare: string;
  };
}
