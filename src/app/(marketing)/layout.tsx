import type { Metadata } from "next";
import "@/components/marketing/marketing.css";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MARKETING_CONFIG } from "@/components/marketing/config";

export const metadata: Metadata = {
  title: `${MARKETING_CONFIG.productName} — Booking & CRM for extension specialists`,
  description:
    "The booking platform built exclusively for hair-extension stylists. Live availability, automatic CRM, hair-texture matching, and maintenance reminders.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-site min-h-screen">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
