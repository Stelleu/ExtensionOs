"use client";

import { useMemo, useState } from "react";
import type { SalonProfile } from "@/types/salon";
import { formatPrice } from "@/lib/format";
import { mockBookedAppointments } from "@/lib/booking/mock-appointments";
import {
  formatDateISO,
  formatDisplayDate,
  getAvailableDates,
  getMonthDays,
  getServiceDurationMinutes,
  getTimeSlots,
  isWorkingDay,
} from "@/lib/booking/availability";

interface BookingWidgetProps {
  salon: SalonProfile;
}

type Step = "service" | "datetime" | "details" | "confirm";

const STEPS: { id: Step; label: string }[] = [
  { id: "service", label: "Service" },
  { id: "datetime", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "confirm", label: "Confirm" },
];

export function BookingWidget({ salon }: BookingWidgetProps) {
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const service = salon.services.find((s) => s.id === serviceId);
  const durationMin = service
    ? getServiceDurationMinutes(service.duration)
    : 120;

  const availableDates = useMemo(
    () => getAvailableDates(mockBookedAppointments, durationMin),
    [durationMin]
  );

  const availableDateSet = useMemo(
    () => new Set(availableDates.map(formatDateISO)),
    [availableDates]
  );

  const timeSlots = useMemo(
    () =>
      selectedDate
        ? getTimeSlots(selectedDate, durationMin, mockBookedAppointments)
        : [],
    [selectedDate, durationMin]
  );

  const monthDays = getMonthDays(calendarMonth.year, calendarMonth.month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function goToDatetime(id: string) {
    setServiceId(id);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep("datetime");
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

  function prevMonth() {
    setCalendarMonth((m) => {
      const d = new Date(m.year, m.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function nextMonth() {
    setCalendarMonth((m) => {
      const d = new Date(m.year, m.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <section id="book" className="border-t border-[#E5DDD4] py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-8 lg:px-12">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
            Book
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2C2825] sm:text-5xl">
            Reserve your appointment
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-[#7A726A]">
            Pick your service, choose an available time — only open slots are
            shown. Deposit taken at confirmation.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mx-auto mt-12 flex max-w-lg items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i <= stepIndex
                      ? "bg-[#2C2825] text-[#FAF6F1]"
                      : "bg-[#E5DDD4] text-[#9C9088]"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="mt-2 hidden text-[10px] uppercase tracking-wider text-[#9C9088] sm:block">
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${i < stepIndex ? "bg-[#2C2825]" : "bg-[#E5DDD4]"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden border border-[#E5DDD4] bg-white">
          {/* ── Step 1: Service ── */}
          {step === "service" && (
            <div className="p-8 lg:p-10">
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#2C2825]">
                What are you booking?
              </h3>
              <p className="mt-1 text-sm text-[#9C9088]">
                Tap a service to see live availability
              </p>
              <div className="mt-8 space-y-3">
                {salon.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToDatetime(s.id)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-[#E5DDD4] bg-[#FAF6F1]/50 p-5 text-left transition-all hover:border-[#C9A897]/40 hover:bg-[#FAF6F1] hover:shadow-md"
                  >
                    <div>
                      <p className="font-medium text-[#2C2825] group-hover:text-[#C9A897]">
                        {s.name}
                      </p>
                      <p className="mt-1 text-sm text-[#9C9088]">
                        {s.duration}
                        {s.deposit ? ` · ${formatPrice(s.deposit)} deposit` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#2C2825]">
                        {formatPrice(s.price)}
                      </p>
                      <p className="mt-1 text-xs text-[#C9A897] opacity-0 transition-opacity group-hover:opacity-100">
                        Choose time →
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Date & Time ── */}
          {step === "datetime" && service && (
            <div className="grid lg:grid-cols-[1fr_280px]">
              <div className="border-b border-[#E5DDD4] p-8 lg:border-b-0 lg:border-r lg:p-10">
                <button
                  type="button"
                  onClick={() => setStep("service")}
                  className="mb-6 text-xs font-medium uppercase tracking-wider text-[#C9A897] hover:underline"
                >
                  ← Change service
                </button>

                <div className="flex items-center justify-between">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-[#2C2825]">
                    {new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex gap-2">
                    <NavBtn onClick={prevMonth} label="Previous month">‹</NavBtn>
                    <NavBtn onClick={nextMonth} label="Next month">›</NavBtn>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div key={d} className="py-2 text-[10px] font-semibold uppercase tracking-wider text-[#9C9088]">
                      {d}
                    </div>
                  ))}
                  {monthDays.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} />;
                    const iso = formatDateISO(date);
                    const isPast = date <= today;
                    const isAvailable = availableDateSet.has(iso);
                    const isSelected = selectedDate === iso;
                    const disabled = isPast || !isWorkingDay(date) || !isAvailable;

                    return (
                      <button
                        key={iso}
                        type="button"
                        disabled={disabled}
                        onClick={() => selectDate(date)}
                        className={`aspect-square rounded-xl text-sm transition-all ${
                          isSelected
                            ? "bg-[#2C2825] font-semibold text-white shadow-md"
                            : disabled
                              ? "cursor-not-allowed text-[#D4CCC4]"
                              : "font-medium text-[#2C2825] hover:bg-[#FAF6F1] hover:ring-1 hover:ring-[#C9A897]/30"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-xs text-[#9C9088]">
                  Greyed-out dates are fully booked or unavailable
                </p>
              </div>

              <div className="bg-[#FAF6F1] p-8 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9C9088]">
                  {selectedDate ? formatDisplayDate(selectedDate) : "Select a date"}
                </p>

                {selectedDate ? (
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => selectTime(slot.time)}
                        className={`rounded-xl py-3 text-sm font-medium transition-all ${
                          slot.available
                            ? "border border-[#E5DDD4] bg-white text-[#2C2825] hover:border-[#2C2825] hover:shadow-sm"
                            : "cursor-not-allowed bg-transparent text-[#D4CCC4] line-through"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-8 text-sm text-[#9C9088]">
                    Choose an available date to see open time slots
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Details ── */}
          {step === "details" && service && selectedDate && selectedTime && (
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-[#E5DDD4] bg-[#FAF6F1] p-8 lg:border-b-0 lg:border-r lg:p-10">
                <button
                  type="button"
                  onClick={() => setStep("datetime")}
                  className="mb-6 text-xs font-medium uppercase tracking-wider text-[#C9A897] hover:underline"
                >
                  ← Change time
                </button>
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#2C2825]">Your appointment</h3>
                <dl className="mt-8 space-y-5">
                  <SummaryRow label="Service" value={service.name} />
                  <SummaryRow label="Date" value={formatDisplayDate(selectedDate)} />
                  <SummaryRow
                    label="Time"
                    value={timeSlots.find((s) => s.time === selectedTime)?.label ?? selectedTime}
                  />
                  <SummaryRow label="Duration" value={service.duration} />
                  <SummaryRow label="Total" value={formatPrice(service.price)} highlight />
                  {service.deposit && service.deposit > 0 && (
                    <SummaryRow
                      label="Deposit today"
                      value={formatPrice(service.deposit)}
                      highlight
                    />
                  )}
                </dl>
              </div>

              <form
                className="space-y-5 p-8 lg:p-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("confirm");
                }}
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#2C2825]">Almost there</h3>
                <Input label="Full name" value={name} onChange={setName} required placeholder="Sarah Smith" />
                <Input label="Email" type="email" value={email} onChange={setEmail} required placeholder="sarah@email.com" />
                <Input label="Phone" type="tel" value={phone} onChange={setPhone} required placeholder="+44 7700 900000" />
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C9088]">
                    Notes (optional)
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Hair type, desired length, any allergies..."
                  className="w-full border border-[#E5DDD4] bg-[#FAF6F1]/50 px-4 py-3 text-sm text-[#2C2825] outline-none transition-colors placeholder:text-[#C4B8B0] focus:border-[#C9A897]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!name || !email || !phone}
                  className="w-full border border-[#2C2825] bg-[#2C2825] py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-[#3D3834] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to payment
                </button>
              </form>
            </div>
          )}

          {/* ── Step 4: Confirm ── */}
          {step === "confirm" && service && selectedDate && selectedTime && (
            <div className="p-8 text-center lg:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]">
                <svg className="h-8 w-8 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-cormorant)] text-3xl text-[#2C2825]">
                You&apos;re all set, {name.split(" ")[0]}!
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[#7A726A]">
                {service.name} on {formatDisplayDate(selectedDate)} at{" "}
                {timeSlots.find((s) => s.time === selectedTime)?.label}. A confirmation
                email will be sent to {email}.
              </p>
              {service.deposit && service.deposit > 0 && (
                <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-[#E5DDD4] bg-[#FAF6F1] p-6">
                  <p className="text-xs uppercase tracking-wider text-[#9C9088]">
                    Stripe payment
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl text-[#2C2825]">
                    {formatPrice(service.deposit)}
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-full bg-[#C9A897] py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#A07F5C]"
                  >
                    Pay deposit & confirm
                  </button>
                  <p className="mt-3 text-[11px] text-[#9C9088]">
                    Secure checkout · Phase 2 integration
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setStep("service");
                  setServiceId(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setNotes("");
                }}
                className="mt-8 text-xs font-medium uppercase tracking-wider text-[#C9A897] hover:underline"
              >
                Book another appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DDD4] text-[#2C2825] transition-colors hover:border-[#2C2825]"
    >
      {children}
    </button>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E5DDD4] pb-4">
      <dt className="text-sm text-[#9C9088]">{label}</dt>
      <dd className={`text-sm font-medium ${highlight ? "font-[family-name:var(--font-cormorant)] text-lg text-[#C9A897]" : "text-[#2C2825]"}`}>
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
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C9088]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
                  className="w-full border border-[#E5DDD4] bg-[#FAF6F1]/50 px-4 py-3.5 text-sm text-[#2C2825] outline-none transition-colors placeholder:text-[#C4B8B0] focus:border-[#C9A897]"
      />
    </label>
  );
}
