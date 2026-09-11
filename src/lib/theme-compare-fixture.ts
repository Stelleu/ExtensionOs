import type { SalonProfile, TemplateId } from "@/types/salon";

/** Shared fixture for /theme-compare QA pages. */
export function compareSalon(templateId: TemplateId): SalonProfile {
  return {
    slug: "compare",
    templateId,
    businessName: "Aura Studio",
    tagline: "Texture-first hair, booked your way",
    city: "London",
    bio: "We specialise in natural textures, protective styles, and colour that loves your hair back. Every appointment starts with a proper consult.",
    heroImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80",
    logoInitials: "AS",
    email: "hello@aura.studio",
    phone: "+44 7700 900123",
    instagram: "@aurastudio",
    address: "London",
    services: [
      {
        id: "1",
        name: "Silk Press",
        description: "Smooth, shiny finish with heat protection.",
        price: 85,
        duration: "2 hours",
        deposit: 25,
      },
      {
        id: "2",
        name: "Tape-In Extensions",
        description: "Lightweight tape-ins with hair supplied.",
        price: 250,
        duration: "3 hours",
        deposit: 50,
        requiresHairAddon: true,
        hairAddonPricing: [
          { length: "16\"", texture: "straight", price: 120 },
          { length: "18\"", texture: "body-wave", price: 140 },
          { length: "20\"", texture: "deep-wave", price: 160 },
          { length: "22\"", texture: "kinky-curly", price: 180 },
        ],
        hairTypeRecommendations: {
          "2a": ["body-wave"],
          "2b": ["body-wave"],
          "2c": ["body-wave", "deep-wave"],
          "3a": ["deep-wave"],
          "3b": ["deep-wave", "kinky-curly"],
          "3c": ["kinky-curly"],
          "4a": ["kinky-curly"],
          "4b": ["kinky-curly"],
          "4c": ["kinky-curly"],
          "1": ["straight"],
        },
      },
      {
        id: "3",
        name: "Colour Refresh",
        description: "Gloss or toner to revive your shade.",
        price: 95,
        duration: "2.5 hours",
        deposit: 30,
      },
      {
        id: "4",
        name: "Wash & Style",
        description: "Deep cleanse, condition, and finish.",
        price: 55,
        duration: "1.5 hours",
        deposit: 15,
      },
    ],
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        alt: "Styled hair",
        label: "Silk press",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1595476108010-b4d1e102bb2f?w=800&q=80",
        alt: "Braids",
        label: "Braids",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
        alt: "Curls",
        label: "Natural",
      },
      {
        id: "g4",
        src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80",
        alt: "Colour",
        label: "Colour",
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Maya",
        rating: 5,
        text: "Best silk press I've had in years — soft, not crispy.",
        date: "Mar 2026",
      },
      {
        id: "r2",
        author: "Jordan",
        rating: 5,
        text: "Booking was easy and the consult actually listened.",
        date: "Feb 2026",
      },
      {
        id: "r3",
        author: "Aisha",
        rating: 5,
        text: "My braids lasted weeks without tension headaches.",
        date: "Jan 2026",
      },
    ],
    faqs: [
      {
        question: "Do I need a deposit?",
        answer: "Yes — a small deposit secures your slot.",
      },
    ],
    policies: {
      deposit: "Deposit required to confirm.",
      cancellation: "Cancel 24h ahead for a full refund of deposit.",
      aftercare: "We'll email aftercare tips after your visit.",
    },
  };
}
