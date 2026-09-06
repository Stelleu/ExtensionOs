import { MarketingHero } from "@/components/marketing/MarketingHero";
import { DemoSection } from "@/components/marketing/DemoSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PositioningSection } from "@/components/marketing/PositioningSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FinalCta } from "@/components/marketing/FinalCta";

export default function MarketingHomePage() {
  return (
    <>
      <MarketingHero />
      <DemoSection />
      <FeaturesSection />
      <PositioningSection />
      <PricingSection />
      <FinalCta />
    </>
  );
}
