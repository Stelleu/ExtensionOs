import type { BookedAppointment, TimeSlot } from "@/types/booking";
import {
  WORKING_DAYS,
  DAY_START,
  DAY_END,
  SLOT_INTERVAL,
} from "@/types/booking";

/** Demo appointments — will come from Supabase in production */
export const mockBookedAppointments: BookedAppointment[] = [
  { date: "2026-08-05", time: "10:00", durationMinutes: 180, serviceId: "tape-in" },
  { date: "2026-08-05", time: "14:00", durationMinutes: 120, serviceId: "maintenance" },
  { date: "2026-08-06", time: "11:00", durationMinutes: 240, serviceId: "sew-in" },
  { date: "2026-08-07", time: "10:30", durationMinutes: 300, serviceId: "microlink" },
  { date: "2026-08-08", time: "13:00", durationMinutes: 180, serviceId: "tape-in" },
  { date: "2026-08-12", time: "10:00", durationMinutes: 120, serviceId: "maintenance" },
  { date: "2026-08-12", time: "15:00", durationMinutes: 180, serviceId: "tape-in" },
];

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
}

function overlaps(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}

export function getServiceDurationMinutes(duration: string): number {
  const hours = duration.match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!hours) return 120;
  const max = hours[2] ? parseInt(hours[2], 10) : parseInt(hours[1], 10);
  return max * 60;
}

export function isWorkingDay(date: Date): boolean {
  return WORKING_DAYS.includes(date.getDay());
}

export function getAvailableDates(
  booked: BookedAppointment[],
  serviceDurationMinutes: number,
  daysAhead = 42
): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (!isWorkingDay(date)) continue;

    const dateStr = formatDateISO(date);
    const slots = getTimeSlots(dateStr, serviceDurationMinutes, booked);
    if (slots.some((s) => s.available)) {
      dates.push(date);
    }
  }

  return dates;
}

export function getTimeSlots(
  dateStr: string,
  serviceDurationMinutes: number,
  booked: BookedAppointment[]
): TimeSlot[] {
  const dayBooked = booked.filter((a) => a.date === dateStr);
  const slots: TimeSlot[] = [];
  const startMin = DAY_START * 60;
  const endMin = DAY_END * 60;

  for (let t = startMin; t + serviceDurationMinutes <= endMin; t += SLOT_INTERVAL) {
    const time = fromMinutes(t);
    const slotEnd = t + serviceDurationMinutes;

    const isTaken = dayBooked.some((appt) => {
      const apptStart = toMinutes(appt.time);
      const apptEnd = apptStart + appt.durationMinutes;
      return overlaps(t, slotEnd, apptStart, apptEnd);
    });

    slots.push({
      time,
      label: formatLabel(time),
      available: !isTaken,
    });
  }

  return slots;
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];

  const startPad = (first.getDay() + 6) % 7; // Mon=0
  for (let i = 0; i < startPad; i++) days.push(null);

  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}
