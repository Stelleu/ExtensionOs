import { notFound } from "next/navigation";
import { SalonTemplate } from "@/components/templates/SalonTemplate";
import { TEMPLATE_IDS } from "@/lib/templates";
import { compareSalon } from "@/lib/theme-compare-fixture";
import type { TemplateId } from "@/types/salon";

export default async function ThemePreviewPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  if (!TEMPLATE_IDS.includes(template as TemplateId)) {
    notFound();
  }

  return <SalonTemplate salon={compareSalon(template as TemplateId)} />;
}
