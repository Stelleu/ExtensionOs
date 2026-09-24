import type { Business, Review, Service } from "@/types/database";
import type { SalonProfile, SalonReview, SalonService } from "@/types/salon";
import { normalizeTemplateId } from "@/lib/templates";
import {
  DEFAULT_AFTERCARE,
  DEFAULT_CANCELLATION_POLICY,
  DEFAULT_DEPOSIT_POLICY,
  DEFAULT_PREP_INSTRUCTIONS,
  formatDurationLabel,
  parseHairAddonPricing,
  parseHairTypePhotos,
  parseHairTypeRecommendations,
  parseGalleryUrls,
  loyaltyPublicNote,
} from "@/lib/salon-helpers";

export function submittedReviewsToSalonReviews(
  reviews: Pick<Review, "id" | "rating" | "comment" | "submitted_at">[]
): SalonReview[] {
  return reviews
    .filter(
      (r): r is typeof r & { rating: number; submitted_at: string } =>
        r.rating != null && r.submitted_at != null
    )
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      text: (r.comment ?? "").trim() || "Great experience.",
      date: formatReviewDate(r.submitted_at),
    }));
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

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
    hairTypeRecommendations: parseHairTypeRecommendations(
      service.hair_type_recommendations
    ),
    isExtensionService: service.is_extension_service,
  };
}

export function businessToSalonProfile(
  business: Business,
  services: Service[],
  reviews: SalonReview[] = []
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
    templateId: normalizeTemplateId(business.template_id),
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
    hairTypePhotos: parseHairTypePhotos(business.hair_type_photos),
    services: services.filter((s) => s.active).map(serviceToSalonService),
    gallery: parseGalleryUrls(business.gallery_urls).map((src, i) => ({
      id: `gallery-${i}`,
      src,
      alt: `${business.name} gallery ${i + 1}`,
    })),
    reviews,
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
    loyaltyNote: business.loyalty_enabled
      ? loyaltyPublicNote(
          business.loyalty_visits_required ?? 5,
          business.loyalty_discount_percent ?? 10
        )
      : null,
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
  template_id?: string;
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
      template_id: draft.template_id ?? "luxury-black-gold",
      instagram: draft.instagram || null,
      email: draft.email || null,
      phone: draft.phone || null,
      location: draft.location || null,
      minimum_booking_notice_hours: 24,
      booking_buffer_minutes: 30,
      cancellation_policy: DEFAULT_CANCELLATION_POLICY,
      payment_link_url: null,
      payment_confirmation_window_hours: 4,
      maintenance_reminder_days_before: 3,
      cancellation_cutoff_hours: 24,
      prep_instructions: DEFAULT_PREP_INSTRUCTIONS,
      care_instructions: DEFAULT_AFTERCARE,
      hair_type_photos: {},
      gallery_urls: [],
      loyalty_enabled: false,
      loyalty_visits_required: 5,
      loyalty_discount_percent: 10,
      created_at: "",
    },
    []
  );
}
