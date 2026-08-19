import type { Business, Service } from "@/types/database";
import type { SalonProfile, SalonService, TemplateId } from "@/types/salon";
import {
  DEFAULT_AFTERCARE,
  DEFAULT_CANCELLATION_POLICY,
  DEFAULT_DEPOSIT_POLICY,
  formatDurationLabel,
  parseHairAddonPricing,
} from "@/lib/salon-helpers";

export function serviceToSalonService(service: Service): SalonService {
  return {
    id: service.id,
    name: service.name,
    description: "",
    price: Number(service.base_price),
    duration: formatDurationLabel(service.duration_minutes),
    durationMinutes: service.duration_minutes,
    deposit: Number(service.deposit_amount),
    requiresHairAddon: service.requires_hair_addon,
    hairAddonPricing: parseHairAddonPricing(service.hair_addon_pricing),
    isExtensionService: service.is_extension_service,
  };
}

export function businessToSalonProfile(
  business: Business,
  services: Service[]
): SalonProfile {
  const initials = business.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: business.id,
    slug: business.slug,
    templateId: (business.template_id as TemplateId) || "luxury-black-gold",
    businessName: business.name,
    tagline: business.tagline || "",
    city: business.location || "",
    bio: business.bio || "",
    heroImage:
      business.hero_image_url ||
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80",
    logoUrl: business.logo_url,
    logoInitials: initials || "HB",
    email: business.email || "",
    phone: business.phone || "",
    instagram: business.instagram || "",
    address: business.location || "",
    services: services.filter((s) => s.active).map(serviceToSalonService),
    gallery: [],
    reviews: [],
    faqs: [
      {
        question: "Do I need a deposit?",
        answer: DEFAULT_DEPOSIT_POLICY,
      },
      {
        question: "What is your cancellation policy?",
        answer: business.cancellation_policy || DEFAULT_CANCELLATION_POLICY,
      },
      {
        question: "How do I book?",
        answer:
          "Choose your service, pick an available slot and pay your deposit online. You'll receive a confirmation email instantly.",
      },
    ],
    policies: {
      deposit: DEFAULT_DEPOSIT_POLICY,
      cancellation: business.cancellation_policy || DEFAULT_CANCELLATION_POLICY,
      aftercare: DEFAULT_AFTERCARE,
    },
  };
}

/** Maps in-progress onboarding fields onto the same SalonProfile the public page uses. */
export function draftToSalonProfile(draft: {
  name: string;
  tagline: string;
  bio: string;
  instagram: string;
  phone: string;
  email: string;
  location: string;
  logo_url: string | null;
  hero_image_url: string | null;
}): SalonProfile {
  return businessToSalonProfile(
    {
      id: "",
      owner_id: null,
      name: draft.name,
      slug: "",
      tagline: draft.tagline || null,
      bio: draft.bio || null,
      logo_url: draft.logo_url,
      hero_image_url: draft.hero_image_url,
      template_id: "luxury-black-gold",
      instagram: draft.instagram || null,
      email: draft.email || null,
      phone: draft.phone || null,
      location: draft.location || null,
      minimum_booking_notice_hours: 24,
      cancellation_policy: DEFAULT_CANCELLATION_POLICY,
      payment_link_url: null,
      payment_confirmation_window_hours: 4,
      maintenance_reminder_days_before: 3,
      cancellation_cutoff_hours: 24,
      created_at: "",
    },
    []
  );
}
