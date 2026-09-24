import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  businessToSalonProfile,
  submittedReviewsToSalonReviews,
} from "@/lib/mappers";
import { SalonTemplate } from "@/components/templates/SalonTemplate";
import { getSalonBySlug } from "@/lib/salons";
import type { Business, Review, Service } from "@/types/database";

interface SalonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SalonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("name, tagline, location")
    .eq("slug", slug)
    .maybeSingle();

  const business = data as Pick<Business, "name" | "tagline" | "location"> | null;

  if (business) {
    return {
      title: `${business.name} | Hair Extensions in ${business.location || ""}`,
      description: business.tagline || undefined,
    };
  }

  const demo = getSalonBySlug(slug);
  if (!demo) return { title: "Salon not found" };
  return {
    title: `${demo.businessName} | Hair Extensions in ${demo.city}`,
    description: demo.tagline,
  };
}

export default async function SalonPage({ params }: SalonPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const business = data as Business | null;

  if (business) {
    const [{ data: serviceRows }, { data: reviewRows }] = await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("business_id", business.id)
        .eq("active", true),
      supabase
        .from("reviews")
        .select("id, rating, comment, submitted_at")
        .eq("business_id", business.id)
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false }),
    ]);

    const salon = businessToSalonProfile(
      business,
      (serviceRows as Service[]) ?? [],
      submittedReviewsToSalonReviews(
        (reviewRows as Pick<
          Review,
          "id" | "rating" | "comment" | "submitted_at"
        >[]) ?? []
      )
    );
    return <SalonTemplate salon={salon} />;
  }

  const demo = getSalonBySlug(slug);
  if (!demo) notFound();
  return <SalonTemplate salon={demo} />;
}
