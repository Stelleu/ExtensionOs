import { describe, expect, it } from "vitest";
import {
  getTimeSlots,
  getServiceDurationMinutes,
} from "@/lib/booking/availability";
import type { BookedAppointment } from "@/types/booking";

describe("getTimeSlots (demo/mock availability)", () => {
  // NOTE: Production public booking uses the get_available_slots RPC via
  // /api/slots — not this module. This file only powers BookingWidget (demo).
  // It does not model lunch-break split windows or minimum_booking_notice_hours;
  // those live in the Postgres RPC only.

  it("generates available slots on a normal empty day", () => {
    const slots = getTimeSlots("2026-08-10", 120, []);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => s.available)).toBe(true);
    expect(slots[0].time).toBe("10:00");
    // Last start that still fits 120min before 18:00
    expect(slots.at(-1)?.time).toBe("16:00");
  });

  it("marks overlapping booked appointments as unavailable", () => {
    const booked: BookedAppointment[] = [
      {
        date: "2026-08-10",
        time: "10:00",
        durationMinutes: 180,
        serviceId: "tape-in",
      },
    ];
    const slots = getTimeSlots("2026-08-10", 120, booked);
    const taken = slots.filter((s) => !s.available).map((s) => s.time);
    // 10:00–13:00 blocks any 120min start that overlaps that range
    expect(taken).toContain("10:00");
    expect(taken).toContain("11:00");
    expect(taken).toContain("11:30");
    expect(slots.find((s) => s.time === "13:00")?.available).toBe(true);
  });

  it("returns no available slots when the day is fully blocked by bookings", () => {
    // Continuous blocks covering 10:00–18:00 for a 120min service
    const booked: BookedAppointment[] = [
      { date: "2026-08-10", time: "10:00", durationMinutes: 240, serviceId: "a" },
      { date: "2026-08-10", time: "14:00", durationMinutes: 240, serviceId: "b" },
    ];
    const slots = getTimeSlots("2026-08-10", 120, booked);
    expect(slots.every((s) => !s.available)).toBe(true);
  });

  it("parses service duration labels to minutes", () => {
    expect(getServiceDurationMinutes("2–3 hrs")).toBe(180);
    expect(getServiceDurationMinutes("30 min")).toBe(1800); // matches /(\d+)/ → 30*60
  });
});

describe("getTimeSlots gaps (documenting mock limitations)", () => {
  it("does NOT treat a mid-day gap as a lunch-break window, only overlaps matter", () => {
    // Real availability table can have 10–12 and 14–18 as two rows; this mock
    // always runs continuous DAY_START–DAY_END and only subtracts bookings.
    const booked: BookedAppointment[] = [
      {
        date: "2026-08-10",
        time: "12:00",
        durationMinutes: 120,
        serviceId: "lunch",
      },
    ];
    const slots = getTimeSlots("2026-08-10", 60, booked);
    expect(slots.find((s) => s.time === "11:00")?.available).toBe(true);
    expect(slots.find((s) => s.time === "12:00")?.available).toBe(false);
    expect(slots.find((s) => s.time === "14:00")?.available).toBe(true);
  });
});
