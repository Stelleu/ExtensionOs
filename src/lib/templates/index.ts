import type { SalonTheme, TemplateId } from "@/types/salon";
import { luxuryBlackGoldTheme } from "@/lib/templates/luxury-black-gold/theme";
import { softEditorialTheme } from "@/lib/templates/soft-editorial/theme";
import { boldAfroTheme } from "@/lib/templates/bold-afro/theme";

export const TEMPLATE_IDS: TemplateId[] = [
  "luxury-black-gold",
  "soft-editorial",
  "bold-afro",
];

export const salonThemes: Record<TemplateId, SalonTheme> = {
  "luxury-black-gold": luxuryBlackGoldTheme,
  "soft-editorial": softEditorialTheme,
  "bold-afro": boldAfroTheme,
};

export function normalizeTemplateId(
  id: string | null | undefined
): TemplateId {
  if (id && id in salonThemes) {
    return id as TemplateId;
  }
  return "luxury-black-gold";
}
