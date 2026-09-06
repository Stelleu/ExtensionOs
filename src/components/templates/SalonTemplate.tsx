import type { SalonProfile } from "@/types/salon";
import { LuxuryBlackGoldTemplate } from "@/components/templates/luxury-black-gold";
import { SoftEditorialTemplate } from "@/components/templates/soft-editorial";
import { BoldAfroTemplate } from "@/components/templates/bold-afro";
import { normalizeTemplateId } from "@/lib/templates";

export function SalonTemplate({ salon }: { salon: SalonProfile }) {
  switch (normalizeTemplateId(salon.templateId)) {
    case "soft-editorial":
      return <SoftEditorialTemplate salon={salon} />;
    case "bold-afro":
      return <BoldAfroTemplate salon={salon} />;
    case "luxury-black-gold":
    default:
      return <LuxuryBlackGoldTemplate salon={salon} />;
  }
}
