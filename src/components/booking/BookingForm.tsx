"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { SalonProfile, SalonService } from "@/types/salon";
import type { HairTexture } from "@/types/database";
import { formatPrice } from "@/lib/format";
import {
  formatDateISO,
  formatDisplayDate,
  formatSlotLabel,
  getMonthDays,
  HAIR_LENGTHS,
  HAIR_TEXTURES,
  getHairAddonPrice,
} from "@/lib/salon-helpers";
import { createBookingCheckout } from "@/lib/actions/business";

interface BookingFormProps {
  salon: SalonProfile;
}

type Step = "service" | "datetime" | "details" | "confirm";

const STEPS: { id: Step; label: string }[] = [
  { id: "service", label: "Service" },
  { id: "datetime", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "confirm", label: "Confirm" },
];

export function BookingForm({ salon }: BookingFormProps) {
  const businessId = salon.id;
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [healthNotesConsent, setHealthNotesConsent] = useState(false);
  const [wantsHairAddon, setWantsHairAddon] = useState(false);
  const [hairLength, setHairLength] = useState<string>('18"');
  const [hairTexture, setHairTexture] = useState<HairTexture>("body-wavy");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const service = salon.services.find((s) => s.id === serviceId) as
    | SalonService
    | undefined;

  const availableDateSet = useMemo(
    () => new Set(availableDates),
    [availableDates]
  );

  const monthDays = getMonthDays(calendarMonth.year, calendarMonth.month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const hairAddonPrice =
    service?.requiresHairAddon && wantsHairAddon
      ? getHairAddonPrice(hairLength)
      : 0;
  const totalPreview = (service?.price ?? 0) + hairAddonPrice;

  useEffect(() => {
    if (!businessId || !serviceId) return;
    setLoadingDates(true);
    fetch(
      `/api/slots?mode=dates&businessId=${businessId}&serviceId=${serviceId}`
    )
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates ?? []))
      .catch(() => setAvailableDates([]))
      .finally(() => setLoadingDates(false));
  }, [businessId, serviceId]);

  useEffect(() => {
    if (!businessId || !serviceId || !selectedDate) return;
    setLoadingSlots(true);
    fetch(
      `/api/slots?businessId=${businessId}&serviceId=${serviceId}&date=${selectedDate}`
    )
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [businessId, serviceId, selectedDate]);

  function goToDatetime(id: string) {
    setServiceId(id);
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
    setWantsHairAddon(false);
    setStep("datetime");
    setError(null);
  }

  function selectDate(date: Date) {
    const iso = formatDateISO(date);
    if (!availableDateSet.has(iso)) return;
    setSelectedDate(iso);
    setSelectedTime(null);
  }

  function selectTime(time: string) {
    setSelectedTime(time);
    setStep("details");
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId || !service || !selectedDate || !selectedTime) return;
    if (healthNotes.trim() && !healthNotesConsent) {
      setError("Consent is required to store health notes.");
      return;
    }
    if (service.requiresHairAddon && wantsHairAddon && !hairLength) {
      setError("Please select a hair length.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const result = await createBookingCheckout({
          businessId,
          serviceId: service.id,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          wantsHairAddon: !!service.requiresHairAddon && wantsHairAddon,
          hairLength:
            service.requiresHairAddon && wantsHairAddon ? hairLength : null,
          hairTexture:
            service.requiresHairAddon && wantsHairAddon ? hairTexture : null,
          healthNotes: healthNotes.trim() || null,
          healthNotesConsent,
        });
        window.location.href = result.checkoutUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Booking failed");
      }
    });
  }

  if (!businessId) {
    return (
      <section id="book" className="bg-[#FAF8F5] py-20 lg:py-28">
        <p className="text-center text-[#6B5E58]">Booking unavailable.</p>
      </section>
    );
  }

  return (
    <section id="book" className="bg-[#FAF8F5] py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
            Book your glam
          </p>
          <h2 className="mt-4 font-serif text-4xl text-[#1A1614] sm:text-5xl">
            Secure your slot
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[#6B5E58]">
            Pick your service, choose an available time — only open slots are
            shown. Deposit taken at confirmation.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-lg items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i <= stepIndex
                      ? "bg-[#1A1614] text-[#FAF8F5]"
                      : "bg-[#E8E0D8] text-[#9C8E86]"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="mt-2 hidden text-[10px] uppercase tracking-wider text-[#9C8E86] sm:block">
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${i < stepIndex ? "bg-[#1A1614]" : "bg-[#E8E0D8]"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5">
          {step === "service" && (
            <div className="p-8 lg:p-10">
              <h3 className="font-serif text-2xl text-[#1A1614]">
                What are you booking?
              </h3>
              <p className="mt-1 text-sm text-[#9C8E86]">
                Tap a service to see live availability
              </p>
              <div className="mt-8 space-y-3">
                {salon.services.length === 0 && (
                  <p className="text-sm text-[#9C8E86]">
                    No services available yet.
                  </p>
                )}
                {salon.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToDatetime(s.id)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-[#E8E0D8] bg-[#FAF8F5]/50 p-5 text-left transition-all hover:border-[#B8956E]/40 hover:bg-[#FAF8F5] hover:shadow-md"
                  >
                    <div>
                      <p className="font-medium text-[#1A1614] group-hover:text-[#B8956E]">
                        {s.name}
                      </p>
                      <p className="mt-1 text-sm text-[#9C8E86]">
                        {s.duration}
                        {s.deposit ? ` · ${formatPrice(s.deposit)} deposit` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl text-[#1A1614]">
                        {formatPrice(s.price)}
                      </p>
                      <p className="mt-1 text-xs text-[#B8956E] opacity-0 transition-opacity group-hover:opacity-100">
                        Choose time →
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "datetime" && service && (
            <div className="grid lg:grid-cols-[1fr_280px]">
              <div className="border-b border-[#E8E0D8] p-8 lg:border-b-0 lg:border-r lg:p-10">
                <button
                  type="button"
                  onClick={() => setStep("service")}
                  className="mb-6 text-xs font-medium uppercase tracking-wider text-[#B8956E] hover:underline"
                >
                  ← Change service
                </button>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-[#1A1614]">
                    {new Date(
                      calendarMonth.year,
                      calendarMonth.month
                    ).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="flex gap-2">
                    <NavBtn
                      onClick={() =>
                        setCalendarMonth((m) => {
                          const d = new Date(m.year, m.month - 1, 1);
                          return { year: d.getFullYear(), month: d.getMonth() };
                        })
                      }
                      label="Previous month"
                    >
                      ‹
                    </NavBtn>
                    <NavBtn
                      onClick={() =>
                        setCalendarMonth((m) => {
                          const d = new Date(m.year, m.month + 1, 1);
                          return { year: d.getFullYear(), month: d.getMonth() };
                        })
                      }
                      label="Next month"
                    >
                      ›
                    </NavBtn>
                  </div>
                </div>
                {loadingDates && (
                  <p className="mt-4 text-sm text-[#9C8E86]">
                    Loading availability…
                  </p>
                )}
                <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div
                      key={d}
                      className="py-2 text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]"
                    >
                      {d}
                    </div>
                  ))}
                  {monthDays.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} />;
                    const iso = formatDateISO(date);
                    const isPast = date <= today;
                    const isAvailable = availableDateSet.has(iso);
                    const isSelected = selectedDate === iso;
                    const disabled = isPast || !isAvailable;
                    return (
                      <button
                        key={iso}
                        type="button"
                        disabled={disabled}
                        onClick={() => selectDate(date)}
                        className={`aspect-square rounded-xl text-sm transition-all ${
                          isSelected
                            ? "bg-[#1A1614] font-semibold text-white shadow-md"
                            : disabled
                              ? "cursor-not-allowed text-[#D4CCC4]"
                              : "font-medium text-[#1A1614] hover:bg-[#FAF8F5] hover:ring-1 hover:ring-[#B8956E]/30"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-[#9C8E86]">
                  Greyed-out dates are fully booked or unavailable
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-8 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9C8E86]">
                  {selectedDate
                    ? formatDisplayDate(selectedDate)
                    : "Select a date"}
                </p>
                {selectedDate ? (
                  loadingSlots ? (
                    <p className="mt-8 text-sm text-[#9C8E86]">Loading slots…</p>
                  ) : (
                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => selectTime(slot)}
                          className="rounded-xl border border-[#E8E0D8] bg-white py-3 text-sm font-medium text-[#1A1614] transition-all hover:border-[#1A1614] hover:shadow-sm"
                        >
                          {formatSlotLabel(slot)}
                        </button>
                      ))}
                      {slots.length === 0 && (
                        <p className="col-span-2 text-sm text-[#9C8E86]">
                          No slots left this day
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <p className="mt-8 text-sm text-[#9C8E86]">
                    Choose an available date to see open time slots
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "details" && service && selectedDate && selectedTime && (
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-[#E8E0D8] bg-[#FAF8F5] p-8 lg:border-b-0 lg:border-r lg:p-10">
                <button
                  type="button"
                  onClick={() => setStep("datetime")}
                  className="mb-6 text-xs font-medium uppercase tracking-wider text-[#B8956E] hover:underline"
                >
                  ← Change time
                </button>
                <h3 className="font-serif text-2xl text-[#1A1614]">
                  Your appointment
                </h3>
                <dl className="mt-8 space-y-5">
                  <SummaryRow label="Service" value={service.name} />
                  <SummaryRow
                    label="Date"
                    value={formatDisplayDate(selectedDate)}
                  />
                  <SummaryRow
                    label="Time"
                    value={formatSlotLabel(selectedTime)}
                  />
                  <SummaryRow label="Duration" value={service.duration} />
                  <SummaryRow
                    label="Total"
                    value={formatPrice(totalPreview)}
                    highlight
                  />
                  {!!service.deposit && service.deposit > 0 && (
                    <SummaryRow
                      label="Deposit today"
                      value={formatPrice(service.deposit)}
                      highlight
                    />
                  )}
                </dl>
              </div>

              <form className="space-y-5 p-8 lg:p-10" onSubmit={submitDetails}>
                <h3 className="font-serif text-2xl text-[#1A1614]">
                  Almost there
                </h3>
                <Input
                  label="Full name"
                  value={name}
                  onChange={setName}
                  required
                  placeholder="Sarah Smith"
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  placeholder="sarah@email.com"
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  required
                  placeholder="+44 7700 900000"
                />

                {service.requiresHairAddon && (
                  <div className="space-y-3 rounded-2xl border border-[#E8E0D8] bg-[#FAF8F5]/50 p-4">
                    <label className="flex items-center gap-3 text-sm text-[#1A1614]">
                      <input
                        type="checkbox"
                        checked={wantsHairAddon}
                        onChange={(e) => setWantsHairAddon(e.target.checked)}
                        className="h-4 w-4 accent-[#B8956E]"
                      />
                      I need hair supplied (+{formatPrice(hairAddonPrice || getHairAddonPrice(hairLength))})
                    </label>
                    {wantsHairAddon && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
                            Length
                          </span>
                          <select
                            value={hairLength}
                            onChange={(e) => setHairLength(e.target.value)}
                            className="w-full rounded-xl border border-[#E8E0D8] bg-white px-3 py-2.5 text-sm"
                          >
                            {HAIR_LENGTHS.map((l) => (
                              <option key={l} value={l}>
                                {l} — {formatPrice(getHairAddonPrice(l))}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
                            Texture
                          </span>
                          <select
                            value={hairTexture}
                            onChange={(e) =>
                              setHairTexture(e.target.value as HairTexture)
                            }
                            className="w-full rounded-xl border border-[#E8E0D8] bg-white px-3 py-2.5 text-sm"
                          >
                            {HAIR_TEXTURES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
                    Health notes (optional)
                  </span>
                  <textarea
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    rows={3}
                    placeholder="Scalp sensitivity, allergies…"
                    className="w-full resize-none rounded-xl border border-[#E8E0D8] bg-[#FAF8F5]/50 px-4 py-3 text-sm text-[#1A1614] outline-none focus:border-[#B8956E] focus:ring-2 focus:ring-[#B8956E]/20"
                  />
                </label>
                <label className="flex items-start gap-3 text-sm text-[#6B5E58]">
                  <input
                    type="checkbox"
                    checked={healthNotesConsent}
                    onChange={(e) => setHealthNotesConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#B8956E]"
                  />
                  I consent to these health notes being stored securely for my
                  appointment (required if notes are provided).
                </label>

                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!name || !email || !phone || pending}
                  className="w-full rounded-full bg-[#1A1614] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#2C2420] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {pending
                    ? "Redirecting to payment…"
                    : service.deposit && service.deposit > 0
                      ? `Pay ${formatPrice(service.deposit)} deposit & book`
                      : "Confirm booking"}
                </button>
              </form>
            </div>
          )}

          {step === "confirm" && (
            <div className="p-8 text-center lg:p-14">
              <p className="text-[#6B5E58]">Redirecting to secure checkout…</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NavBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E0D8] text-[#1A1614] transition-colors hover:border-[#1A1614]"
    >
      {children}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E8E0D8] pb-4">
      <dt className="text-sm text-[#9C8E86]">{label}</dt>
      <dd
        className={`text-sm font-medium ${highlight ? "font-serif text-lg text-[#B8956E]" : "text-[#1A1614]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E8E0D8] bg-[#FAF8F5]/50 px-4 py-3.5 text-sm text-[#1A1614] outline-none placeholder:text-[#C4B8B0] focus:border-[#B8956E] focus:ring-2 focus:ring-[#B8956E]/20"
      />
    </label>
  );
}
