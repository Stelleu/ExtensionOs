import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSalonBySlug } from "@/lib/salons";
import { SalonTemplate } from "@/components/templates/SalonTemplate";

interface SalonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SalonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const salon = getSalonBySlug(slug);

  if (!salon) {
    return { title: "Salon not found" };
  }

  return {
    title: `${salon.businessName} | Hair Extensions in ${salon.city}`,
    description: salon.tagline,
  };
}

export default async function SalonPage({ params }: SalonPageProps) {
  const { slug } = await params;
  const salon = getSalonBySlug(slug);

  if (!salon) {
    notFound();
  }

  return <SalonTemplate salon={salon} />;
}
