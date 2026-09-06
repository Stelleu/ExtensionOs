/** Marketing-site configuration — adjust pricing here without hunting through components. */
export const MARKETING_CONFIG = {
  productName: "ExtensionOS",
  tagline: "Booking & CRM built for hair-extension specialists",
  monthlyPrice: 19,
  currency: "£",
  trialLabel: "Start your free trial",
  signupPath: "/signup",
  demoSalonPath: "/luxehairlondon",
  contactEmail: "hello@extensionos.com",
  social: {
    instagram: "https://instagram.com/extensionos",
    tiktok: "https://tiktok.com/@extensionos",
  },
} as const;

export const PRICING_FEATURES = [
  "Custom booking website with your brand",
  "Live availability & deposit checkout",
  "Automatic client CRM — zero manual entry",
  "Hair-texture consultation & match suggestions",
  "Maintenance reminder emails",
  "3 premium site themes",
  "Dashboard for bookings, clients & services",
  "Prep & aftercare email automation",
] as const;
