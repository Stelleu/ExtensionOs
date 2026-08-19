"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  createOrUpdateBusiness,
  createService,
  setAvailability,
  updateBookingSettings,
  uploadBusinessAsset,
} from "@/lib/actions/business";
import {
  DEFAULT_CANCELLATION_POLICY,
  DEFAULT_HAIR_ADDON_PRICING,
  defaultWeekSchedule,
  scheduleToRows,
  type DayAvailability,
} from "@/lib/salon-helpers";
import { HairAddonPricingEditor } from "@/components/services/HairAddonPricingEditor";
import type { HairAddonPriceRow } from "@/types/database";
import { AvailabilityEditor } from "@/components/availability/AvailabilityEditor";
import { BookingSettingsFields } from "@/components/availability/BookingSettingsFields";
import { OnboardingSitePreview } from "@/components/onboarding/OnboardingSitePreview";
import { draftToSalonProfile } from "@/lib/mappers";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

export function OnboardingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [generatingStep, setGeneratingStep] = useState(0);

  const [profile, setProfile] = useState({
    name: "",
    tagline: "",
    bio: "",
    instagram: "",
    phone: "",
    email: "",
    location: "",
    logo_url: "" as string | null,
    hero_image_url: "" as string | null,
  });

  const [service, setService] = useState({
    name: "Tape-In Extensions",
    base_price: 250,
    deposit_amount: 50,
    duration_minutes: 180,
    requires_hair_addon: true,
    is_extension_service: true,
    hair_addon_pricing: DEFAULT_HAIR_ADDON_PRICING as HairAddonPriceRow[],
  });

  const [schedule, setSchedule] = useState<DayAvailability[]>(defaultWeekSchedule);
  const [noticeHours, setNoticeHours] = useState(24);
  const [cancellationPolicy, setCancellationPolicy] = useState(
    DEFAULT_CANCELLATION_POLICY
  );
  const [paymentLinkUrl, setPaymentLinkUrl] = useState("");
  const [confirmationWindowHours, setConfirmationWindowHours] = useState(4);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  const [setupReady, setSetupReady] = useState(false);
  const [step1Panel, setStep1Panel] = useState<"edit" | "preview">("edit");
  const [pendingFiles, setPendingFiles] = useState<{
    logo?: File;
    hero?: File;
  }>({});
  const [localPreview, setLocalPreview] = useState<{
    logo?: string;
    hero?: string;
  }>({});

  const draftSalon = useMemo(
    () =>
      draftToSalonProfile({
        ...profile,
        logo_url: localPreview.logo || profile.logo_url,
        hero_image_url: localPreview.hero || profile.hero_image_url,
      }),
    [profile, localPreview]
  );

  useEffect(() => {
    return () => {
      if (localPreview.logo) URL.revokeObjectURL(localPreview.logo);
      if (localPreview.hero) URL.revokeObjectURL(localPreview.hero);
    };
    // Only revoke on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectImage(file: File, kind: "logo" | "hero") {
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview((p) => {
      const prev = kind === "logo" ? p.logo : p.hero;
      if (prev) URL.revokeObjectURL(prev);
      return kind === "logo" ? { ...p, logo: objectUrl } : { ...p, hero: objectUrl };
    });
    setPendingFiles((p) =>
      kind === "logo" ? { ...p, logo: file } : { ...p, hero: file }
    );
  }

  async function uploadPendingImage(file: File, kind: "logo" | "hero") {
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", kind);
    const { url } = await uploadBusinessAsset(fd);
    return url;
  }

  function saveStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const nextProfile = { ...profile };
        if (pendingFiles.logo) {
          nextProfile.logo_url = await uploadPendingImage(pendingFiles.logo, "logo");
        }
        if (pendingFiles.hero) {
          nextProfile.hero_image_url = await uploadPendingImage(
            pendingFiles.hero,
            "hero"
          );
        }
        setProfile(nextProfile);
        const biz = await createOrUpdateBusiness(nextProfile);
        setBusinessId(biz.id);
        setBusinessSlug(biz.slug);
        if (typeof biz.minimum_booking_notice_hours === "number") {
          setNoticeHours(biz.minimum_booking_notice_hours);
        }
        if (biz.cancellation_policy) {
          setCancellationPolicy(biz.cancellation_policy);
        }
        if (biz.payment_link_url) {
          setPaymentLinkUrl(biz.payment_link_url);
        }
        if (typeof biz.payment_confirmation_window_hours === "number") {
          setConfirmationWindowHours(biz.payment_confirmation_window_hours);
        }
        setStep(2);
      } catch (err) {
        const raw = err instanceof Error ? err.message : String(err);
        if (raw.includes("PGRST002") || raw.includes("schema cache")) {
          setError(
            "Supabase database is not ready (schema cache). Open Supabase → SQL Editor, run extensionOsBDD.sql fully, then wait ~30s and retry."
          );
        } else {
          setError(raw || "Failed to save profile");
        }
      }
    });
  }

  function saveStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) return;
    setError(null);
    startTransition(async () => {
      try {
        await createService({ business_id: businessId, ...service });
        setStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create service");
      }
    });
  }

  function skipService() {
    setStep(3);
  }

  function saveStep3(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId) return;
    const rows = scheduleToRows(schedule);
    if (rows.length === 0) {
      setError(
        "Turn on at least one day, or skip for now. Clients cannot book until availability is set."
      );
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await setAvailability(businessId, rows);
        await updateBookingSettings({
          business_id: businessId,
          minimum_booking_notice_hours: noticeHours,
          cancellation_policy: cancellationPolicy,
          payment_link_url: paymentLinkUrl,
          payment_confirmation_window_hours: confirmationWindowHours,
        });
        setStep(4);
        runGenerating();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save hours");
      }
    });
  }

  function skipAvailability() {
    if (!businessId) {
      setStep(4);
      runGenerating();
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await updateBookingSettings({
          business_id: businessId,
          minimum_booking_notice_hours: noticeHours,
          cancellation_policy: cancellationPolicy,
          payment_link_url: paymentLinkUrl,
          payment_confirmation_window_hours: confirmationWindowHours,
        });
        setStep(4);
        runGenerating();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save settings");
      }
    });
  }

  function runGenerating() {
    setSetupReady(false);
    setGeneratingStep(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setGeneratingStep(i);
      if (i >= 4) {
        clearInterval(timer);
        setSetupReady(true);
      }
    }, 900);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#B8956E]">
        Onboarding · Step {step} of 4
      </p>
      <div className="mt-4 mb-8 flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-[#1A1614]" : "bg-[#E8E0D8]"}`}
          />
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl text-[#1A1614]">
                Business profile
              </h1>
              <p className="mt-1 text-sm text-[#6B5E58]">
                This powers your public booking page.
              </p>
            </div>
            <div className="flex rounded-full bg-white p-1 ring-1 ring-[#1A1614]/10">
              <button
                type="button"
                onClick={() => setStep1Panel("edit")}
                className={`rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                  step1Panel === "edit"
                    ? "bg-[#1A1614] text-white"
                    : "text-[#6B5E58]"
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setStep1Panel("preview")}
                className={`rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                  step1Panel === "preview"
                    ? "bg-[#1A1614] text-white"
                    : "text-[#6B5E58]"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          <form
            onSubmit={saveStep1}
            className={`space-y-4 rounded-3xl bg-white p-8 ring-1 ring-[#1A1614]/5 ${
              step1Panel === "edit" ? "" : "hidden"
            }`}
          >
            <Field
              label="Business name"
              value={profile.name}
              onChange={(v) => setProfile({ ...profile, name: v })}
              required
            />
            <Field
              label="Tagline"
              value={profile.tagline}
              onChange={(v) => setProfile({ ...profile, tagline: v })}
            />
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
                Bio
              </span>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                value={profile.email}
                onChange={(v) => setProfile({ ...profile, email: v })}
                placeholder="hello@yoursalon.com"
              />
              <Field
                label="Phone"
                value={profile.phone}
                onChange={(v) => setProfile({ ...profile, phone: v })}
              />
              <Field
                label="Instagram"
                value={profile.instagram}
                onChange={(v) => setProfile({ ...profile, instagram: v })}
                placeholder="@yoursalon"
              />
            </div>
            <Field
              label="Location"
              value={profile.location}
              onChange={(v) => setProfile({ ...profile, location: v })}
              placeholder="Shoreditch, London"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FileField
                label="Logo"
                onFile={(f) => selectImage(f, "logo")}
                preview={localPreview.logo || profile.logo_url}
              />
              <FileField
                label="Hero image"
                onFile={(f) => selectImage(f, "hero")}
                preview={localPreview.hero || profile.hero_image_url}
              />
            </div>
            <p className="text-xs text-[#9C8E86]">
              Images preview instantly. They upload when you tap Continue.
            </p>
            <button
              type="submit"
              disabled={pending || !profile.name}
              className="w-full rounded-full bg-[#1A1614] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-40"
            >
              {pending ? "Saving…" : "Continue"}
            </button>
          </form>

          {step1Panel === "preview" && (
            <OnboardingSitePreview salon={draftSalon} />
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={saveStep2} className="space-y-4 rounded-3xl bg-white p-8 ring-1 ring-[#1A1614]/5">
          <h1 className="font-serif text-3xl text-[#1A1614]">First service</h1>
          <p className="text-sm text-[#6B5E58]">
            Highly recommended — clients need something to book. You can add more later.
          </p>
          <Field
            label="Service name"
            value={service.name}
            onChange={(v) => setService({ ...service, name: v })}
            required
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Price (£)"
              value={service.base_price}
              onChange={(v) => setService({ ...service, base_price: v })}
            />
            <NumberField
              label="Deposit (£)"
              value={service.deposit_amount}
              onChange={(v) => setService({ ...service, deposit_amount: v })}
            />
            <NumberField
              label="Duration (min)"
              value={service.duration_minutes}
              onChange={(v) => setService({ ...service, duration_minutes: v })}
            />
          </div>
          <Toggle
            label="Requires hair addon question"
            checked={service.requires_hair_addon}
            onChange={(v) =>
              setService({
                ...service,
                requires_hair_addon: v,
                hair_addon_pricing:
                  v && service.hair_addon_pricing.length === 0
                    ? DEFAULT_HAIR_ADDON_PRICING
                    : service.hair_addon_pricing,
              })
            }
          />
          {service.requires_hair_addon && (
            <HairAddonPricingEditor
              rows={service.hair_addon_pricing}
              onChange={(hair_addon_pricing) =>
                setService({ ...service, hair_addon_pricing })
              }
            />
          )}
          <Toggle
            label="Extension service (enables 6-week maintenance reminder)"
            checked={service.is_extension_service}
            onChange={(v) => setService({ ...service, is_extension_service: v })}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={skipService}
              className="flex-1 rounded-full border border-[#E8E0D8] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5E58]"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-full bg-[#1A1614] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-40"
            >
              {pending ? "Saving…" : "Continue"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={saveStep3} className="space-y-8 rounded-3xl bg-white p-8 ring-1 ring-[#1A1614]/5">
          <div>
            <h1 className="font-serif text-3xl text-[#1A1614]">
              Availability &amp; booking settings
            </h1>
            <p className="mt-2 text-sm text-[#6B5E58]">
              Clients can only book times you set here. You can skip and add
              hours later from the dashboard — until then, no slots will appear.
            </p>
          </div>

          <AvailabilityEditor schedule={schedule} onChange={setSchedule} />
          <BookingSettingsFields
            noticeHours={noticeHours}
            cancellationPolicy={cancellationPolicy}
            paymentLinkUrl={paymentLinkUrl}
            confirmationWindowHours={confirmationWindowHours}
            onNoticeChange={setNoticeHours}
            onPolicyChange={setCancellationPolicy}
            onPaymentLinkChange={setPaymentLinkUrl}
            onConfirmationWindowChange={setConfirmationWindowHours}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={skipAvailability}
              disabled={pending}
              className="flex-1 rounded-full border border-[#E8E0D8] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5E58] disabled:opacity-40"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-full bg-[#1A1614] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-40"
            >
              {pending ? "Saving…" : "Finish setup"}
            </button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-[#1A1614]/5">
          <h1 className="font-serif text-3xl text-[#1A1614]">
            {setupReady
              ? "Your booking site is ready."
              : "Creating your business space…"}
          </h1>
          <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm text-[#6B5E58]">
            <GenItem
              done={generatingStep >= 1}
              label="Setting up your booking page"
            />
            <GenItem
              done={generatingStep >= 2}
              label="Applying your availability"
            />
            <GenItem
              done={generatingStep >= 3}
              label="Preparing your booking settings"
            />
            <GenItem
              done={generatingStep >= 4}
              label="Creating your client consultation form"
            />
          </ul>
          {setupReady && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {businessSlug && (
                <Link
                  href={`/${businessSlug}`}
                  className="rounded-full bg-[#1A1614] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                >
                  View my website
                </Link>
              )}
              <Link
                href="/dashboard"
                className="rounded-full border border-[#E8E0D8] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5E58]"
              >
                Go to dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GenItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-3 ${done ? "text-[#1A1614]" : ""}`}>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${done ? "bg-[#1A1614] text-white" : "bg-[#E8E0D8] text-[#9C8E86]"}`}
      >
        {done ? "✓" : "…"}
      </span>
      {label}
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm outline-none focus:border-[#B8956E]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-[#1A1614]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#B8956E]"
      />
      {label}
    </label>
  );
}

function FileField({
  label,
  onFile,
  preview,
}: {
  label: string;
  onFile: (f: File) => void;
  preview?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
        {label}
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
        className="w-full text-sm"
      />
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="mt-2 h-16 w-16 rounded-lg object-cover ring-1 ring-[#E8E0D8]"
        />
      )}
    </label>
  );
}
