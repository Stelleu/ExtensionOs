"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeTemplateId } from "@/lib/templates";
import type { TemplateId } from "@/types/salon";

export type ReviewInvitePayload = {
  token: string;
  alreadySubmitted: boolean;
  businessName: string;
  templateId: TemplateId;
  salonSlug: string;
};

export type ReviewActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function getReviewInviteByToken(
  token: string
): Promise<ReviewInvitePayload | null> {
  if (!token || !isUuid(token)) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reviews")
    .select(
      `
      submission_token,
      submitted_at,
      businesses ( name, template_id, slug )
    `
    )
    .eq("submission_token", token)
    .maybeSingle();

  if (error || !data) return null;

  const business = data.businesses as unknown as {
    name: string;
    template_id: string | null;
    slug: string;
  } | null;

  if (!business) return null;

  return {
    token: data.submission_token as string,
    alreadySubmitted: data.submitted_at != null,
    businessName: business.name,
    templateId: normalizeTemplateId(business.template_id),
    salonSlug: business.slug,
  };
}

export async function submitReview(
  token: string,
  rating: number,
  comment: string
): Promise<ReviewActionResult> {
  if (!token || !isUuid(token)) {
    return { ok: false, error: "Invalid review link." };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Please choose a rating from 1 to 5 stars." };
  }

  const trimmed = comment.trim().slice(0, 2000);
  const admin = createAdminClient();

  const { data: existing, error: lookupError } = await admin
    .from("reviews")
    .select("id, submitted_at")
    .eq("submission_token", token)
    .maybeSingle();

  if (lookupError || !existing) {
    return { ok: false, error: "This review link is invalid or has expired." };
  }

  if (existing.submitted_at) {
    return { ok: false, error: "You've already left a review. Thank you!" };
  }

  const { error: updateError } = await admin
    .from("reviews")
    .update({
      rating,
      comment: trimmed.length > 0 ? trimmed : null,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .is("submitted_at", null);

  if (updateError) {
    return { ok: false, error: "Could not save your review. Please try again." };
  }

  return { ok: true };
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
