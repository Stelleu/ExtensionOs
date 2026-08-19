import type { SalonProfile } from "@/types/salon";

export const demoSalons: Record<string, SalonProfile> = {
  luxehairlondon: {
    slug: "luxehairlondon",
    templateId: "luxury-black-gold",
    businessName: "Luxe Hair London",
    tagline: "Premium hair extensions, tailored to you",
    city: "London",
    bio: "Specialist in luxury tape-in, sew-in and microlink extensions. Every install is custom-blended for a seamless, natural finish. Based in East London, serving clients who want premium hair without the salon drama.",
    heroImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80",
    logoInitials: "LH",
    email: "hello@luxehairlondon.co.uk",
    phone: "+44 7700 900123",
    instagram: "@luxehairlondon",
    address: "Shoreditch, London E1",
    services: [
      {
        id: "tape-in",
        name: "Tape-In Extensions",
        description:
          "Lightweight, reusable tape-ins blended to match your natural texture. Full head install with premium Remy hair.",
        price: 250,
        duration: "2–3 hrs",
        deposit: 50,
      },
      {
        id: "sew-in",
        name: "Sew-In Weave",
        description:
          "Secure, long-lasting sew-in on a braided base. Ideal for protective styling and maximum volume.",
        price: 180,
        duration: "3–4 hrs",
        deposit: 40,
      },
      {
        id: "microlink",
        name: "Microlink Extensions",
        description:
          "No glue, no braids. Individual links for flexible movement and a natural fall.",
        price: 320,
        duration: "4–5 hrs",
        deposit: 60,
      },
      {
        id: "maintenance",
        name: "Maintenance & Move-Up",
        description:
          "Re-tape, tighten links or refresh your blend. Keep your extensions looking flawless.",
        price: 80,
        duration: "1–2 hrs",
        deposit: 25,
      },
      {
        id: "consultation",
        name: "Extension Consultation",
        description:
          "Colour match, length planning and method recommendation. Required for first-time clients.",
        price: 0,
        duration: "30 min",
      },
    ],
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1583724711595-ed09eedf1ff8?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Long blonde extensions",
        label: "Tape-in · 22 inch",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1662933171697-12b14aef1c3e?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Sleek brunette sew-in",
        label: "Sew-in · Natural blend",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1757649733951-ccfd842ae328?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Volume microlink install",
        label: "Microlink · Volume",
      },
      {
        id: "g4",
        src: "https://images.unsplash.com/photo-1755519024779-ff6e5016db0b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0",
        alt: "Before and after transformation",
        label: "Before / After",
      },
      {
        id: "g5",
        src:"https://images.unsplash.com/photo-1655267009613-ae7f13da112d?q=80&w=1377&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Curly texture extensions",
        label: "Curly blend",
      },
      {
        id: "g6",
        src: "https://images.unsplash.com/photo-1724124419963-4ba797267047?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Balayage with extensions",
        label: "Balayage blend",
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        rating: 5,
        text: "Best extensions I've ever had. The blend is invisible and the maintenance reminders are a lifesaver. Worth every penny.",
        date: "June 2026",
      },
      {
        id: "r2",
        author: "Amara K.",
        rating: 5,
        text: "Professional from start to finish. Deposit system meant I actually showed up on time and the install was flawless.",
        date: "May 2026",
      },
      {
        id: "r3",
        author: "Jess T.",
        rating: 5,
        text: "Finally found someone in London who understands textured hair extensions. My sew-in lasted 8 weeks perfectly.",
        date: "April 2026",
      },
    ],
    faqs: [
      {
        question: "How long do extensions last?",
        answer:
          "Tape-ins and microlinks typically last 6–8 weeks before a maintenance appointment. Sew-ins can last 8–10 weeks with proper care.",
      },
      {
        question: "Do I need a deposit?",
        answer:
          "Yes. A non-refundable deposit secures your appointment slot. It's deducted from your total on the day of your install.",
      },
      {
        question: "Can I bring my own hair?",
        answer:
          "Yes, if it's 100% Remy human hair and approved during your consultation. I also supply premium hair if you prefer.",
      },
      {
        question: "How do I book?",
        answer:
          "Choose your service, pick an available slot and pay your deposit online. You'll receive a confirmation email instantly.",
      },
    ],
    policies: {
      deposit:
        "A deposit is required to confirm all bookings (except free consultations). Deposits are non-refundable but transferrable with 48 hours notice.",
      cancellation:
        "Cancel or reschedule at least 48 hours before your appointment. Late cancellations forfeit the deposit.",
      aftercare:
        "Avoid oil-based products at the bonds, sleep with hair in a loose braid, and book maintenance every 6–8 weeks for best results.",
    },
  },
};

export function getSalonBySlug(slug: string): SalonProfile | undefined {
  return demoSalons[slug];
}
