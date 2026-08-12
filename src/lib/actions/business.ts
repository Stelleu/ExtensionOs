"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateConsultationFormSchema } from "@/lib/consultation-forms";
import { formatDateISO, getHairAddonPrice, slugify } from "@/lib/salon-helpers";
import { getStripe } from "@/lib/stripe";
import type { BookingStatus, HairTexture } from "@/types/database";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

export async function getOwnBusiness() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

function emptyToNull(value?: string | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function createOrUpdateBusiness(input: {
  name: string;
  tagline?: string;
  bio?: string;
  instagram?: string;
  phone?: string;
  location?: string;
  email?: string;
  logo_url?: string | null;
  hero_image_url?: string | null;
  template_id?: string;
}) {
  const { supabase, user } = await requireUser();
  const existing = await getOwnBusiness();
  const logoUrl = emptyToNull(input.logo_url);
  const heroUrl = emptyToNull(input.hero_image_url);

  if (existing) {
    const { data, error } = await supabase
      .from("businesses")
      .update({
        name: input.name,
        tagline: emptyToNull(input.tagline),
        bio: emptyToNull(input.bio),
        instagram: emptyToNull(input.instagram),
        phone: emptyToNull(input.phone),
        location: emptyToNull(input.location),
        email: emptyToNull(input.email) ?? user.email ?? null,
        logo_url: logoUrl ?? existing.logo_url,
        hero_image_url: heroUrl ?? existing.hero_image_url,
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  let baseSlug = slugify(input.name) || "my-salon";
  let slug = baseSlug;
  let attempt = 0;
  while (attempt < 20) {
    const { data: clash } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt + 1}`;
  }

  const { data, error } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      name: input.name,
      slug,
      tagline: emptyToNull(input.tagline),
      bio: emptyToNull(input.bio),
      instagram: emptyToNull(input.instagram),
      phone: emptyToNull(input.phone),
      location: emptyToNull(input.location),
      email: emptyToNull(input.email) ?? user.email ?? null,
      logo_url: logoUrl,
      hero_image_url: heroUrl,
      template_id: input.template_id ?? "luxury-black-gold",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createService(input: {
  business_id: string;
  name: string;
  base_price: number;
  deposit_amount: number;
  duration_minutes: number;
  requires_hair_addon: boolean;
  is_extension_service: boolean;
}) {
  const { supabase, user } = await requireUser();
  const { data: biz } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", input.business_id)
    .eq("owner_id", user.id)
    .single();
  if (!biz) throw new Error("Business not found");

  const schema = generateConsultationFormSchema(
    input.name,
    input.is_extension_service
  );

  const { data, error } = await supabase
    .from("services")
    .insert({
      business_id: input.business_id,
      name: input.name,
      base_price: input.base_price,
      deposit_amount: input.deposit_amount,
      duration_minutes: input.duration_minutes,
      requires_hair_addon: input.requires_hair_addon,
      is_extension_service: input.is_extension_service,
      active: true,
      consultation_form_schema: schema,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/services");
  return data;
}

export async function updateService(
  serviceId: string,
  input: Partial<{
    name: string;
    base_price: number;
    deposit_amount: number;
    duration_minutes: number;
    requires_hair_addon: boolean;
    is_extension_service: boolean;
    active: boolean;
  }>
) {
  await requireUser();
  const supabase = await createClient();

  const patch: Record<string, unknown> = { ...input };
  if (input.name !== undefined || input.is_extension_service !== undefined) {
    const { data: current } = await supabase
      .from("services")
      .select("name, is_extension_service")
      .eq("id", serviceId)
      .single();
    if (current) {
      patch.consultation_form_schema = generateConsultationFormSchema(
        input.name ?? current.name,
        input.is_extension_service ?? current.is_extension_service
      );
    }
  }

  const { data, error } = await supabase
    .from("services")
    .update(patch)
    .eq("id", serviceId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/services");
  return data;
}

export async function setAvailability(
  businessId: string,
  rows: { day_of_week: number; start_time: string; end_time: string }[]
) {
  const { supabase, user } = await requireUser();
  const { data: biz } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();
  if (!biz) throw new Error("Business not found");

  const invalid = rows.find((r) => !(r.start_time < r.end_time));
  if (invalid) {
    throw new Error("Each time window must end after it starts.");
  }

  const { data: previous, error: prevError } = await supabase
    .from("availability")
    .select("day_of_week, start_time, end_time")
    .eq("business_id", businessId);
  if (prevError) throw new Error(prevError.message);

  const { error: deleteError } = await supabase
    .from("availability")
    .delete()
    .eq("business_id", businessId);
  if (deleteError) throw new Error(deleteError.message);

  if (rows.length === 0) return [];

  const { data, error } = await supabase
    .from("availability")
    .insert(rows.map((r) => ({ ...r, business_id: businessId })))
    .select();

  if (error) {
    if (previous && previous.length > 0) {
      await supabase.from("availability").insert(
        previous.map((r) => ({
          business_id: businessId,
          day_of_week: r.day_of_week,
          start_time: r.start_time,
          end_time: r.end_time,
        }))
      );
    }
    throw new Error(error.message);
  }
  return data;
}

export async function updateBookingSettings(input: {
  business_id: string;
  minimum_booking_notice_hours: number;
  cancellation_policy: string;
}) {
  const { supabase, user } = await requireUser();
  const allowed = [0, 12, 24, 48];
  if (!allowed.includes(input.minimum_booking_notice_hours)) {
    throw new Error("Invalid notice period");
  }
  const policy = input.cancellation_policy.trim();
  if (!policy) throw new Error("Cancellation policy cannot be empty");

  const { data, error } = await supabase
    .from("businesses")
    .update({
      minimum_booking_notice_hours: input.minimum_booking_notice_hours,
      cancellation_policy: policy,
    })
    .eq("id", input.business_id)
    .eq("owner_id", user.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/availability");
  return data;
}

export async function addBlockedTime(input: {
  business_id: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  reason?: string;
}) {
  const { supabase, user } = await requireUser();
  const { data: biz } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", input.business_id)
    .eq("owner_id", user.id)
    .single();
  if (!biz) throw new Error("Business not found");

  const { data, error } = await supabase
    .from("blocked_times")
    .insert({
      business_id: input.business_id,
      date: input.date,
      start_time: input.start_time ?? null,
      end_time: input.end_time ?? null,
      reason: input.reason ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/availability");
  return data;
}

export async function deleteBlockedTime(id: string) {
  const { supabase } = await requireUser();
  const own = await getOwnBusiness();
  if (!own) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("blocked_times")
    .delete()
    .eq("id", id)
    .eq("business_id", own.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/availability");
}

export async function getAvailableSlotsAction(
  businessId: string,
  serviceId: string,
  date: string
): Promise<string[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("get_available_slots", {
    p_business_id: businessId,
    p_service_id: serviceId,
    p_date: date,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { slot_time: string }) =>
    String(row.slot_time).slice(0, 5)
  );
}

export async function getAvailableDatesAction(
  businessId: string,
  serviceId: string,
  daysAhead = 42
): Promise<string[]> {
  const admin = createAdminClient();
  const { data: availability } = await admin
    .from("availability")
    .select("day_of_week")
    .eq("business_id", businessId);

  const workingDays = new Set((availability ?? []).map((a) => a.day_of_week));
  if (workingDays.size === 0) return [];

  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (!workingDays.has(d.getDay())) continue;
    const iso = formatDateISO(d);
    const slots = await getAvailableSlotsAction(businessId, serviceId, iso);
    if (slots.length > 0) dates.push(iso);
  }
  return dates;
}

export interface CreateBookingInput {
  businessId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  wantsHairAddon: boolean;
  hairLength?: string | null;
  hairTexture?: HairTexture | null;
  healthNotes?: string | null;
  healthNotesConsent: boolean;
}

export async function createBookingCheckout(input: CreateBookingInput) {
  if (input.healthNotes && !input.healthNotesConsent) {
    throw new Error("health_notes_consent is required before storing health notes");
  }

  const admin = createAdminClient();

  const { data: service, error: serviceError } = await admin
    .from("services")
    .select("*")
    .eq("id", input.serviceId)
    .eq("business_id", input.businessId)
    .eq("active", true)
    .single();
  if (serviceError || !service) throw new Error("Service not found");

  const { data: business } = await admin
    .from("businesses")
    .select("id, name, slug")
    .eq("id", input.businessId)
    .single();
  if (!business) throw new Error("Business not found");

  const slots = await getAvailableSlotsAction(
    input.businessId,
    input.serviceId,
    input.appointmentDate
  );
  const timeNorm = input.appointmentTime.slice(0, 5);
  if (!slots.includes(timeNorm)) {
    throw new Error("Selected slot is no longer available");
  }

  // Upsert client by email within business (service role)
  let clientId: string;
  const email = input.clientEmail.trim().toLowerCase();
  const { data: existingClient } = await admin
    .from("clients")
    .select("id, health_notes_consent")
    .eq("business_id", input.businessId)
    .eq("email", email)
    .maybeSingle();

  const healthNotes =
    input.healthNotesConsent && input.healthNotes?.trim()
      ? input.healthNotes.trim()
      : null;

  if (existingClient) {
    const { data: updated, error } = await admin
      .from("clients")
      .update({
        name: input.clientName.trim(),
        phone: input.clientPhone.trim(),
        health_notes: healthNotes,
        health_notes_consent: input.healthNotesConsent,
      })
      .eq("id", existingClient.id)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    clientId = updated.id;
  } else {
    const { data: created, error } = await admin
      .from("clients")
      .insert({
        business_id: input.businessId,
        name: input.clientName.trim(),
        email,
        phone: input.clientPhone.trim(),
        health_notes: healthNotes,
        health_notes_consent: input.healthNotesConsent,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    clientId = created.id;
  }

  const wantsAddon = service.requires_hair_addon && input.wantsHairAddon;
  const hairAddonPrice = wantsAddon
    ? getHairAddonPrice(input.hairLength)
    : 0;
  const servicePrice = Number(service.base_price);
  const totalPrice = servicePrice + hairAddonPrice;
  const depositAmount = Number(service.deposit_amount);

  const { data: booking, error: bookingError } = await admin
    .from("bookings")
    .insert({
      business_id: input.businessId,
      client_id: clientId,
      service_id: input.serviceId,
      appointment_date: input.appointmentDate,
      appointment_time: `${timeNorm}:00`,
      wants_hair_addon: wantsAddon,
      hair_length: wantsAddon ? input.hairLength ?? null : null,
      hair_texture: wantsAddon ? input.hairTexture ?? null : null,
      hair_addon_price: hairAddonPrice,
      service_price: servicePrice,
      total_price: totalPrice,
      deposit_amount: depositAmount,
      deposit_paid: false,
      status: "pending_payment",
    })
    .select()
    .single();

  if (bookingError || !booking) {
    throw new Error(bookingError?.message ?? "Booking failed");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (depositAmount <= 0) {
    await admin
      .from("bookings")
      .update({ deposit_paid: true, status: "confirmed" })
      .eq("id", booking.id);
    return {
      bookingId: booking.id,
      checkoutUrl: `${appUrl}/booking/success?booking_id=${booking.id}&slug=${business.slug}`,
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(depositAmount * 100),
          product_data: {
            name: `Deposit — ${service.name}`,
            description: `${business.name} · ${input.appointmentDate} ${timeNorm}`,
          },
        },
      },
    ],
    customer_email: email,
    metadata: {
      booking_id: booking.id,
      business_id: input.businessId,
    },
    success_url: `${appUrl}/booking/success?booking_id=${booking.id}&slug=${business.slug}`,
    cancel_url: `${appUrl}/${business.slug}?booking=cancelled`,
  });

  if (session.payment_intent) {
    await admin
      .from("bookings")
      .update({
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent.id,
      })
      .eq("id", booking.id);
  }

  if (!session.url) throw new Error("Stripe session missing URL");

  return { bookingId: booking.id, checkoutUrl: session.url };
}

export async function updateBookingStatus(
  bookingId: string,
  status: Extract<BookingStatus, "completed" | "no_show" | "cancelled" | "confirmed">
) {
  const { supabase } = await requireUser();
  const own = await getOwnBusiness();
  if (!own) throw new Error("Unauthorized");

  const { data: ownedBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("id", bookingId)
    .eq("business_id", own.id)
    .maybeSingle();
  if (!ownedBooking) throw new Error("Booking not found");

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
}

export async function deleteClient(clientId: string) {
  const { supabase } = await requireUser();
  const own = await getOwnBusiness();
  if (!own) throw new Error("Unauthorized");

  // Cancel future bookings first if restrict on client_id — schema uses on delete restrict
  // So we must delete/cancel bookings first via admin, then delete client
  const admin = createAdminClient();
  const { data: client } = await admin
    .from("clients")
    .select("id, business_id")
    .eq("id", clientId)
    .eq("business_id", own.id)
    .single();
  if (!client) throw new Error("Client not found");

  await admin.from("bookings").delete().eq("client_id", clientId);
  const { error } = await admin.from("clients").delete().eq("id", clientId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/clients");
}

async function ensureBusinessAssetsBucket() {
  const admin = createAdminClient();
  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) throw new Error(listError.message);

  const exists = (buckets ?? []).some((b) => b.name === "business-assets");
  if (exists) return;

  const { error: createError } = await admin.storage.createBucket(
    "business-assets",
    {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    }
  );

  // Ignore race if another request created it first
  if (
    createError &&
    !createError.message.toLowerCase().includes("already exists")
  ) {
    throw new Error(
      `Could not create storage bucket: ${createError.message}. Create a PUBLIC bucket named "business-assets" in Supabase → Storage.`
    );
  }
}

export async function uploadBusinessAsset(
  formData: FormData
): Promise<{ url: string }> {
  const { supabase, user } = await requireUser();
  const file = formData.get("file") as File | null;
  const kind = (formData.get("kind") as string) || "asset";
  if (!file) throw new Error("No file provided");

  await ensureBusinessAssetsBucket();

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${kind}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("business-assets")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    // Retry once after ensuring bucket (in case list was stale)
    if (
      error.message?.toLowerCase().includes("bucket") ||
      (error as { statusCode?: string }).statusCode === "404"
    ) {
      await ensureBusinessAssetsBucket();
      const retry = await supabase.storage
        .from("business-assets")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (retry.error) throw new Error(retry.error.message);
    } else {
      throw new Error(error.message);
    }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("business-assets").getPublicUrl(path);

  return { url: publicUrl };
}
