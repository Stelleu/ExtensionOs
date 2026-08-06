import type { SalonProfile } from "@/types/salon";
import { LuxuryBlackGoldTemplate } from "@/components/templates/luxury-black-gold";

export function SalonTemplate({ salon }: { salon: SalonProfile }) {
  switch (salon.templateId) {
    case "luxury-black-gold":
      return <LuxuryBlackGoldTemplate salon={salon} />;
    default:
      return <LuxuryBlackGoldTemplate salon={salon} />;
  }
}
