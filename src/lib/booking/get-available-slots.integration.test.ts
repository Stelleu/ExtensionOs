/**
 * Integration tests for the production Postgres RPC `get_available_slots`.
 *
 * REQUIRES a real Supabase project (ideally dedicated test/staging).
 * Do NOT run against a production database with real client data —
 * this suite inserts and deletes fixture rows via the service role.
 *
 * Env vars (same as the app — do not invent new names):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Load from `.env.local` or `.env` before running:
 *   npm run test:integration
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const full = resolve(process.cwd(), file);
    if (!existsSync(full)) continue;
    for (const line of readFileSync(full, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

loadEnvFiles();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const describeIntegration =
  url && serviceKey ? describe : describe.skip;

function isoDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Next calendar date (UTC) whose getUTCDay() === dow (0=Sun … 6=Sat). */
function nextUtcWeekday(dow: number, minDaysAhead = 14): string {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + minDaysAhead);
  while (d.getUTCDay() !== dow) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return isoDateUTC(d);
}

function normalizeSlot(value: string): string {
  return String(value).slice(0, 5);
}

/** Monday 09:00–17:00, 60‑min service, 30‑min steps → 15 starts (09:00…16:00). */
const EXPECTED_MONDAY_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
] as const;

describeIntegration("get_available_slots (live RPC)", () => {
  let supabase: SupabaseClient;
  let businessId: string;
  let serviceId: string;
  let clientId: string;

  const availabilityIds: string[] = [];
  const blockedIds: string[] = [];
  const bookingIds: string[] = [];

  const monday = nextUtcWeekday(1, 14);
  const wednesday = nextUtcWeekday(3, 14);
  const sunday = nextUtcWeekday(0, 14);

  async function rpcSlots(date: string): Promise<string[]> {
    const { data, error } = await supabase.rpc("get_available_slots", {
      p_business_id: businessId,
      p_service_id: serviceId,
      p_date: date,
    });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: { slot_time: string }) =>
      normalizeSlot(row.slot_time)
    );
  }

  beforeAll(async () => {
    supabase = createClient(url!, serviceKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const slug = `vitest-slots-${Date.now()}`;
    const { data: biz, error: bizErr } = await supabase
      .from("businesses")
      .insert({
        name: "Vitest Slots Fixture",
        slug,
        minimum_booking_notice_hours: 2,
      })
      .select("id")
      .single();
    if (bizErr || !biz) throw new Error(bizErr?.message ?? "business insert failed");
    businessId = biz.id;

    const { data: svc, error: svcErr } = await supabase
      .from("services")
      .insert({
        business_id: businessId,
        name: "Vitest 60min",
        base_price: 100,
        deposit_amount: 20,
        duration_minutes: 60,
        active: true,
      })
      .select("id")
      .single();
    if (svcErr || !svc) throw new Error(svcErr?.message ?? "service insert failed");
    serviceId = svc.id;

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({
        business_id: businessId,
        name: "Vitest Client",
        email: `vitest-slots-${Date.now()}@example.com`,
      })
      .select("id")
      .single();
    if (clientErr || !client) {
      throw new Error(clientErr?.message ?? "client insert failed");
    }
    clientId = client.id;

    const { data: avail, error: availErr } = await supabase
      .from("availability")
      .insert([
        {
          business_id: businessId,
          day_of_week: 1,
          start_time: "09:00",
          end_time: "17:00",
        },
        {
          business_id: businessId,
          day_of_week: 3,
          start_time: "09:00",
          end_time: "12:00",
        },
        {
          business_id: businessId,
          day_of_week: 3,
          start_time: "13:00",
          end_time: "17:00",
        },
      ])
      .select("id");
    if (availErr || !avail) {
      throw new Error(availErr?.message ?? "availability insert failed");
    }
    availabilityIds.push(...avail.map((r) => r.id));
  });

  afterAll(async () => {
    if (!supabase || !businessId) return;

    if (bookingIds.length) {
      await supabase.from("bookings").delete().in("id", bookingIds);
    }
    if (blockedIds.length) {
      await supabase.from("blocked_times").delete().in("id", blockedIds);
    }
    if (availabilityIds.length) {
      await supabase.from("availability").delete().in("id", availabilityIds);
    }
    // Also clear any leftover rows scoped to this business (safety net)
    await supabase.from("bookings").delete().eq("business_id", businessId);
    await supabase.from("blocked_times").delete().eq("business_id", businessId);
    await supabase.from("availability").delete().eq("business_id", businessId);
    if (clientId) {
      await supabase.from("clients").delete().eq("id", clientId);
    }
    if (serviceId) {
      await supabase.from("services").delete().eq("id", serviceId);
    }
    await supabase.from("businesses").delete().eq("id", businessId);
  });

  it("returns expected 30-min starts on a normal open Monday", async () => {
    const slots = await rpcSlots(monday);
    expect(slots).toEqual([...EXPECTED_MONDAY_SLOTS]);
  });

  it("skips the Wednesday lunch gap and resumes at 13:00", async () => {
    const slots = await rpcSlots(wednesday);

    // No start whose 60-min service would overlap 12:00–13:00
    for (const slot of slots) {
      const [h, m] = slot.split(":").map(Number);
      const startMin = h * 60 + m;
      const endMin = startMin + 60;
      const overlapsLunch = startMin < 13 * 60 && endMin > 12 * 60;
      expect(overlapsLunch).toBe(false);
    }

    expect(slots).toContain("11:00");
    expect(slots).not.toContain("11:30");
    expect(slots).not.toContain("12:00");
    expect(slots).not.toContain("12:30");
    expect(slots).toContain("13:00");
    expect(slots[slots.indexOf("13:00") - 1]).toBe("11:00");
  });

  it("returns zero rows on a day with no availability", async () => {
    const slots = await rpcSlots(sunday);
    expect(slots).toEqual([]);
  });

  it("returns zero rows when the day is fully blocked", async () => {
    const { data, error } = await supabase
      .from("blocked_times")
      .insert({
        business_id: businessId,
        date: monday,
        start_time: null,
        end_time: null,
        reason: "vitest full-day block",
      })
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "block insert failed");
    blockedIds.push(data.id);

    try {
      const slots = await rpcSlots(monday);
      expect(slots).toEqual([]);
    } finally {
      await supabase.from("blocked_times").delete().eq("id", data.id);
      const idx = blockedIds.indexOf(data.id);
      if (idx >= 0) blockedIds.splice(idx, 1);
    }
  });

  it("excludes slots overlapping a partial block (14:00–15:00)", async () => {
    const { data, error } = await supabase
      .from("blocked_times")
      .insert({
        business_id: businessId,
        date: monday,
        start_time: "14:00",
        end_time: "15:00",
        reason: "vitest partial block",
      })
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "block insert failed");
    blockedIds.push(data.id);

    try {
      const slots = await rpcSlots(monday);
      // Postgres OVERLAPS is half-open: 13:00–14:00 does not overlap 14:00–15:00
      expect(slots).toContain("13:00");
      expect(slots).not.toContain("13:30");
      expect(slots).not.toContain("14:00");
      expect(slots).not.toContain("14:30");
      expect(slots).toContain("15:00");
    } finally {
      await supabase.from("blocked_times").delete().eq("id", data.id);
      const idx = blockedIds.indexOf(data.id);
      if (idx >= 0) blockedIds.splice(idx, 1);
    }
  });

  it("excludes confirmed bookings but not cancelled ones", async () => {
    const { data: confirmed, error: cErr } = await supabase
      .from("bookings")
      .insert({
        business_id: businessId,
        client_id: clientId,
        service_id: serviceId,
        appointment_date: monday,
        appointment_time: "10:00",
        service_price: 100,
        total_price: 100,
        deposit_amount: 20,
        status: "confirmed",
        confirmation_deadline: new Date(Date.now() + 86400000).toISOString(),
      })
      .select("id")
      .single();
    if (cErr || !confirmed) {
      throw new Error(cErr?.message ?? "confirmed booking insert failed");
    }
    bookingIds.push(confirmed.id);

    const withConfirmed = await rpcSlots(monday);
    // 10:00–11:00 blocks starts that OVERLAP that range (not 09:00 which only touches)
    expect(withConfirmed).toContain("09:00");
    expect(withConfirmed).not.toContain("09:30");
    expect(withConfirmed).not.toContain("10:00");
    expect(withConfirmed).not.toContain("10:30");
    expect(withConfirmed).toContain("11:00");

    await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_reason: "stylist_cancelled" })
      .eq("id", confirmed.id);

    const afterCancel = await rpcSlots(monday);
    expect(afterCancel).toContain("09:30");
    expect(afterCancel).toContain("10:00");
    expect(afterCancel).toContain("10:30");

    await supabase.from("bookings").delete().eq("id", confirmed.id);
    const idx = bookingIds.indexOf(confirmed.id);
    if (idx >= 0) bookingIds.splice(idx, 1);
  });

  it("excludes slots inside the minimum booking notice window", async () => {
    // Pick the soonest day that still has bookable slots with notice=0
    await supabase
      .from("businesses")
      .update({ minimum_booking_notice_hours: 0 })
      .eq("id", businessId);

    const today = isoDateUTC(new Date());
    const todayDow = new Date(`${today}T12:00:00Z`).getUTCDay();

    const { data: todayAvail, error: todayAvailErr } = await supabase
      .from("availability")
      .insert({
        business_id: businessId,
        day_of_week: todayDow,
        start_time: "00:00",
        end_time: "23:30",
      })
      .select("id")
      .single();
    if (todayAvailErr || !todayAvail) {
      throw new Error(todayAvailErr?.message ?? "today availability insert failed");
    }
    availabilityIds.push(todayAvail.id);

    let probeDate = today;
    let baseline = await rpcSlots(probeDate);

    if (baseline.length < 2) {
      // Late in the UTC day — walk forward until we have a usable window
      for (let i = 1; i <= 7 && baseline.length < 2; i++) {
        const d = new Date(`${today}T12:00:00Z`);
        d.setUTCDate(d.getUTCDate() + i);
        probeDate = isoDateUTC(d);
        const dow = d.getUTCDay();
        const { data: row, error } = await supabase
          .from("availability")
          .insert({
            business_id: businessId,
            day_of_week: dow,
            start_time: "00:00",
            end_time: "23:30",
          })
          .select("id")
          .single();
        if (!error && row) availabilityIds.push(row.id);
        baseline = await rpcSlots(probeDate);
      }
    }

    expect(baseline.length).toBeGreaterThanOrEqual(2);

    const pivot = baseline[Math.floor(baseline.length / 2)];
    const [ph, pm] = pivot.split(":").map(Number);
    const pivotUtc = Date.UTC(
      Number(probeDate.slice(0, 4)),
      Number(probeDate.slice(5, 7)) - 1,
      Number(probeDate.slice(8, 10)),
      ph,
      pm,
      0,
      0
    );
    const hoursUntilPivot = (pivotUtc - Date.now()) / 3_600_000;
    const noticeHours = Math.max(1, Math.ceil(hoursUntilPivot) + 1);

    await supabase
      .from("businesses")
      .update({ minimum_booking_notice_hours: noticeHours })
      .eq("id", businessId);

    const filtered = await rpcSlots(probeDate);
    const cutoffMs = Date.now() + noticeHours * 3_600_000;

    const wouldExclude = baseline.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      const ts = Date.UTC(
        Number(probeDate.slice(0, 4)),
        Number(probeDate.slice(5, 7)) - 1,
        Number(probeDate.slice(8, 10)),
        h,
        m,
        0,
        0
      );
      return ts < cutoffMs;
    });
    const wouldKeep = baseline.filter((slot) => !wouldExclude.includes(slot));

    expect(wouldExclude.length).toBeGreaterThan(0);
    for (const slot of wouldExclude) {
      expect(filtered).not.toContain(slot);
    }
    for (const slot of wouldKeep) {
      expect(filtered).toContain(slot);
    }

    // Restore fixture default for any later assertions
    await supabase
      .from("businesses")
      .update({ minimum_booking_notice_hours: 2 })
      .eq("id", businessId);
  });
});
