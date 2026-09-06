/**
 * Setup verification for HairBoss AI / ExtensionOS Supabase schema.
 *
 * Do NOT run against a production database with real client data unless you
 * intentionally want to audit that environment (read-only checks only).
 *
 * Env vars (same as the app):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Prefers RPC `verify_setup_checks` (migration 005). Falls back to client-side
 * probes when that function is not deployed yet.
 *
 * Usage: npm run verify:setup
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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

type CheckResult = { check_id: string; ok: boolean; detail: string };

function printCheck(check: CheckResult) {
  if (check.ok) {
    console.log(`✅ ${check.check_id}`);
  } else {
    console.log(`❌ MISSING: ${check.check_id}${check.detail ? ` (${check.detail})` : ""}`);
  }
}

async function columnExists(
  supabase: SupabaseClient,
  table: string,
  column: string
): Promise<boolean> {
  const { error } = await supabase.from(table).select(column).limit(0);
  if (!error) return true;
  const msg = error.message.toLowerCase();
  if (msg.includes("does not exist") || msg.includes("column")) return false;
  // Other errors (empty table, RLS) still mean the column is addressable
  return !msg.includes(column.toLowerCase());
}

async function runRpcChecks(supabase: SupabaseClient): Promise<CheckResult[] | null> {
  const { data, error } = await supabase.rpc("verify_setup_checks");
  if (error) {
    console.log(
      `ℹ️  verify_setup_checks RPC unavailable (${error.message}).` +
        ` Apply supabase/migrations/005_verify_setup_checks.sql for cron/default/type checks.`
    );
    return null;
  }
  return (data ?? []) as CheckResult[];
}

async function runFallbackChecks(supabase: SupabaseClient): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  const businessCols = [
    "minimum_booking_notice_hours",
    "cancellation_policy",
    "payment_link_url",
    "payment_confirmation_window_hours",
    "maintenance_reminder_days_before",
    "cancellation_cutoff_hours",
  ];
  for (const col of businessCols) {
    const ok = await columnExists(supabase, "businesses", col);
    results.push({
      check_id: `businesses.${col}`,
      ok,
      detail: ok ? "present" : "missing column",
    });
  }

  const bookingCols = [
    "confirmation_token",
    "confirmation_deadline",
    "stylist_notified_at",
    "cancelled_reason",
  ];
  for (const col of bookingCols) {
    const ok = await columnExists(supabase, "bookings", col);
    results.push({
      check_id: `bookings.${col}`,
      ok,
      detail: ok ? "present" : "missing column",
    });
  }

  // Behavioral: confirmation_token default
  {
    const check_id = "bookings.confirmation_token default (gen_random_uuid)";
    const slug = `verify-setup-${Date.now()}`;
    let businessId: string | null = null;
    let serviceId: string | null = null;
    let clientId: string | null = null;
    let bookingId: string | null = null;
    try {
      const { data: biz, error: bizErr } = await supabase
        .from("businesses")
        .insert({ name: "verify-setup", slug })
        .select("id")
        .single();
      if (bizErr || !biz) throw new Error(bizErr?.message ?? "biz");
      businessId = biz.id;

      const { data: svc, error: svcErr } = await supabase
        .from("services")
        .insert({
          business_id: businessId,
          name: "verify",
          base_price: 1,
          deposit_amount: 0,
          duration_minutes: 30,
        })
        .select("id")
        .single();
      if (svcErr || !svc) throw new Error(svcErr?.message ?? "svc");
      serviceId = svc.id;

      const { data: client, error: clientErr } = await supabase
        .from("clients")
        .insert({ business_id: businessId, name: "verify" })
        .select("id")
        .single();
      if (clientErr || !client) throw new Error(clientErr?.message ?? "client");
      clientId = client.id;

      const { data: booking, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          business_id: businessId,
          client_id: clientId,
          service_id: serviceId,
          appointment_date: "2099-01-01",
          appointment_time: "10:00",
          service_price: 1,
          total_price: 1,
          deposit_amount: 0,
          status: "cancelled",
          cancelled_reason: "stylist_cancelled",
        })
        .select("id, confirmation_token")
        .single();
      if (bookingErr || !booking) throw new Error(bookingErr?.message ?? "booking");
      bookingId = booking.id;

      const token = booking.confirmation_token;
      const ok =
        typeof token === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          token
        );
      results.push({
        check_id,
        ok,
        detail: ok ? "uuid defaulted on insert" : `got ${String(token)}`,
      });
    } catch (err) {
      results.push({
        check_id,
        ok: false,
        detail: err instanceof Error ? err.message : "probe failed",
      });
    } finally {
      if (bookingId) await supabase.from("bookings").delete().eq("id", bookingId);
      if (clientId) await supabase.from("clients").delete().eq("id", clientId);
      if (serviceId) await supabase.from("services").delete().eq("id", serviceId);
      if (businessId) await supabase.from("businesses").delete().eq("id", businessId);
    }
  }

  // Behavioral: hair_texture accepts free text (not old enum)
  {
    const check_id = "bookings.hair_texture is text";
    const slug = `verify-texture-${Date.now()}`;
    let businessId: string | null = null;
    let serviceId: string | null = null;
    let clientId: string | null = null;
    let bookingId: string | null = null;
    try {
      const { data: biz, error: bizErr } = await supabase
        .from("businesses")
        .insert({ name: "verify-texture", slug })
        .select("id")
        .single();
      if (bizErr || !biz) throw new Error(bizErr?.message ?? "biz");
      businessId = biz.id;

      const { data: svc, error: svcErr } = await supabase
        .from("services")
        .insert({
          business_id: businessId,
          name: "verify",
          base_price: 1,
          deposit_amount: 0,
          duration_minutes: 30,
        })
        .select("id")
        .single();
      if (svcErr || !svc) throw new Error(svcErr?.message ?? "svc");
      serviceId = svc.id;

      const { data: client, error: clientErr } = await supabase
        .from("clients")
        .insert({ business_id: businessId, name: "verify" })
        .select("id")
        .single();
      if (clientErr || !client) throw new Error(clientErr?.message ?? "client");
      clientId = client.id;

      const marker = `free-text-texture-${Date.now()}`;
      const { data: booking, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          business_id: businessId,
          client_id: clientId,
          service_id: serviceId,
          appointment_date: "2099-01-02",
          appointment_time: "10:00",
          service_price: 1,
          total_price: 1,
          deposit_amount: 0,
          status: "cancelled",
          cancelled_reason: "stylist_cancelled",
          hair_texture: marker,
        })
        .select("id, hair_texture")
        .single();
      if (bookingErr || !booking) throw new Error(bookingErr?.message ?? "booking");
      bookingId = booking.id;

      const ok = booking.hair_texture === marker;
      results.push({
        check_id,
        ok,
        detail: ok ? "accepted free-text value" : "value rejected or coerced",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "probe failed";
      results.push({
        check_id,
        ok: false,
        detail: msg,
      });
    } finally {
      if (bookingId) await supabase.from("bookings").delete().eq("id", bookingId);
      if (clientId) await supabase.from("clients").delete().eq("id", clientId);
      if (serviceId) await supabase.from("services").delete().eq("id", serviceId);
      if (businessId) await supabase.from("businesses").delete().eq("id", businessId);
    }
  }

  for (const [table, col] of [
    ["services", "hair_addon_pricing"],
    ["clients", "image_consent"],
  ] as const) {
    const ok = await columnExists(supabase, table, col);
    results.push({
      check_id: `${table}.${col}`,
      ok,
      detail: ok ? "present" : "missing column",
    });
  }

  results.push({
    check_id: "cron.job expire-pending-bookings",
    ok: false,
    detail: "requires verify_setup_checks RPC (migration 005)",
  });
  results.push({
    check_id: "cron.job send-maintenance-reminders",
    ok: false,
    detail: "requires verify_setup_checks RPC (migration 005)",
  });

  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  const bucket = (buckets ?? []).find(
    (b) => b.id === "business-assets" || b.name === "business-assets"
  );
  results.push({
    check_id: "storage.buckets business-assets (public)",
    ok: !!bucket?.public,
    detail: bucketErr
      ? bucketErr.message
      : !bucket
        ? "bucket missing"
        : bucket.public
          ? "public"
          : "bucket exists but not public",
  });

  return results;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (set in .env.local / .env)."
    );
    process.exit(1);
  }

  console.log("HairBoss AI setup verification");
  console.log(`Target: ${url}`);
  console.log(
    "Warning: use a test/staging project — do not point this at production client data casually.\n"
  );

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const rpcResults = await runRpcChecks(supabase);
  const results = rpcResults ?? (await runFallbackChecks(supabase));

  let failed = 0;
  for (const check of results) {
    printCheck(check);
    if (!check.ok) failed += 1;
  }

  console.log("");
  if (failed > 0) {
    console.log(`${failed} check(s) failed.`);
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
