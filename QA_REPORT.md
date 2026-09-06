# QA Report — ExtensionOS / HairBoss AI

Diagnostic code-path audit. No live Supabase or browser was available; findings
come from reading the implementation end-to-end. Automated unit tests were added
in Part A (`npm test` — 15 passing as of this report).

**Do not treat this document as a change list to apply blindly.** Each issue
should become its own scoped follow-up task.

---

## Part A — Unit tests added

| Area | File | Notes |
|------|------|--------|
| Demo slot logic | `src/lib/booking/availability.test.ts` | Tests `getTimeSlots` / duration parsing. **This is not the production slot engine** (see §2). |
| Hair addon pricing | `src/lib/salon-helpers.pricing.test.ts` | `parseHairAddonPricing` / `findHairAddonPrice` |
| Formatting | `src/lib/format.test.ts` | `formatPrice` in `format.ts`; date/time helpers live in `salon-helpers.ts` (called out in tests) |

Run: `npm test` (vitest). Config: `vitest.config.ts`.

---

## 1. Onboarding

**Path:** `OnboardingWizard.tsx` → server actions in `src/lib/actions/business.ts`

| Step | UI | Persist | Verdict |
|------|----|---------|---------|
| 1 — Business profile + Edit/Preview | Local draft → preview via iframe `/onboarding/preview-frame` | On Continue: optional Storage upload (`uploadBusinessAsset`), then `createOrUpdateBusiness` → `businesses` (name, tagline, bio, instagram, phone, email, location, logo_url, hero_image_url, slug, template_id) | **OK** — preview does not write to DB on keystroke |
| 2 — First service (+ hair addon pricing) | Form + `HairAddonPricingEditor` | `createService` → `services` including `hair_addon_pricing` jsonb when `requires_hair_addon` | **OK** — skippable without creating a service |
| 3 — Availability + booking settings | Combined on one form | `setAvailability` (delete-all then insert for `business_id`) + `updateBookingSettings` → `businesses.minimum_booking_notice_hours`, `cancellation_policy`, `payment_link_url`, `payment_confirmation_window_hours` | **OK** — re-save replaces availability rows (no duplicates). Skip still runs `updateBookingSettings` |
| 4 — Generation screen | Fake progress timers | No DB writes | **Mismatch vs “dashboard redirect”:** Step 4 shows links (“View my website” / “Go to dashboard”) when `setupReady`; there is **no automatic redirect** |

### Onboarding findings

- **OK:** Step 3 delete+insert with rollback on insert failure (`setAvailability`).
- **Risk:** Step 1 uploads images via `uploadBusinessAsset` **before** the business row may exist (path is `user.id/...`). Works with auth; Storage is not tied to `businesses.id`.
- **Risk (preview crash):** Empty contact fields can throw in public components reused by preview — e.g. `Contact.tsx` calls `salon.phone.replace(...)` and `salon.instagram.replace(...)` without guarding empty strings. Same pattern in `InstagramStrip.tsx`.

---

## 2. Public booking flow

**Path:** `[slug]/page.tsx` → `SalonTemplate` → `BookingForm` (when `salon.id` set) → `createBookingCheckout` → `/booking/success`

### Step order in code (actual)

1. Service selection  
2. Date & time (`/api/slots?mode=dates` then `/api/slots?date=…` → `getAvailableSlotsAction` → RPC `get_available_slots`)  
3. Details: contact + **hair addon** (if `requiresHairAddon`) + health notes/consent + **image consent**  
4. Submit → create booking → redirect  

**Mismatch vs product narrative** that ordered “service → hair addon → consultation → date → slot”: the live UI collects addon + consents **after** the slot is chosen. Behavior is coherent; docs/expectations should match the code.

### Persistence on submit (`createBookingCheckout`)

| Concern | Implementation | Verdict |
|---------|----------------|---------|
| Slot still free | Re-checks via `getAvailableSlotsAction` before insert | **OK** |
| Client upsert | By email + `business_id`; writes `health_notes` only with consent; sets `image_consent` | **OK** |
| Hair addon price | From `services.hair_addon_pricing` via `findHairAddonPrice`; invalid combo throws | **OK** |
| `confirmation_deadline` | `now + payment_confirmation_window_hours` on insert | **OK** (audit Part B) |
| `confirmation_token` | **Not set in the INSERT** — relies on DB default (`gen_random_uuid()` in migration `004`) | **Gap if 004 not applied** → `notify-stylist` returns 422 “missing confirmation_token” |
| Status | `pending_payment`; zero deposit → immediately `confirmed` + `deposit_paid` | **OK** |
| Redirect | `/booking/success?booking_id=&slug=` → `PendingPaymentScreen` with `businesses.payment_link_url` | **OK** |
| Notify stylist | `void invokeEdgeFunction("notify-stylist", { booking_id })` only when deposit &gt; 0 | **OK** for deposits; **zero-deposit bookings never notify** |

### Slot source of truth

- Production: **Postgres RPC only** (`getAvailableSlotsAction` → admin RPC).  
- `src/lib/booking/availability.ts` is **demo-only** (used by `BookingWidget` when `salon.id` is falsy). It does **not** implement lunch-break windows or `minimum_booking_notice_hours`.

---

## 3. Confirmation flow

| Check | Result |
|-------|--------|
| `supabase/functions/notify-stylist` exists | **Yes** |
| Invoked after booking create | **Yes** — fire-and-forget with `{ booking_id }` (`business.ts` ~554) |
| Email confirm link format | `{SITE_URL}/confirm-booking/{confirmation_token}` |
| App proxy | `src/app/confirm-booking/[token]/route.ts` → `…/functions/v1/confirm-booking/{token}` |
| Edge Function expects | GET, token in path (`extractPathToken(..., "confirm-booking")`), lookup by `confirmation_token` | **Formats match** |

### Confirmation findings

- **OK:** `confirm-booking` validates status `pending_payment`, deadline, then sets `confirmed` + `deposit_paid`, emails client (with cancel link), 302 to `/booking-confirmed?booking_id=`.
- **Dependency:** Requires DB column + default for `confirmation_token` (migration 004 / live SQL). App insert does not generate the token itself.
- **Ops:** Function must be deployed; `SITE_URL` / `RESEND_API_KEY` must be set. Failures are only `console.error`’d from `invokeEdgeFunction`.

---

## 4. Cancellation flow

| Artifact | Status |
|----------|--------|
| `supabase/functions/cancel-booking` | **Exists** |
| App proxy `/cancel-booking/[token]` | **Exists** — forwards to Edge Function |
| Client email link | Added in `confirm-booking` client confirmation email: `{SITE_URL}/cancel-booking/{token}` |
| Stylist cancel from dashboard | `updateBookingStatus(..., "cancelled")` sets `cancelled_reason: 'stylist_cancelled'` |

**Verdict:** Client-initiated cancellation **is built** (not a missing feature), gated by `businesses.cancellation_cutoff_hours`. Separate from expiry path (`notify-expired-booking` / `payment_not_confirmed`).

---

## 5. Dashboard booking status

**Path:** `AppointmentCard` → `updateBookingStatus`

- Loads own business via `getOwnBusiness()`, then verifies booking `business_id === own.id` before update. **Ownership check: OK.**
- Uses RLS-backed `createClient()` for the update (not admin).
- Completing a booking only sets `status: 'completed'`. Loyalty / maintenance are handled by DB trigger `trg_booking_completed` → `handle_booking_completed()` in `001_extension_os.sql` (`visit_count++`, `maintenance_due_date = appointment_date + 42 days` for extension services). **No duplicated frontend logic — OK.**

---

## 6. RLS / `createAdminClient()` spot-check

Admin client **bypasses RLS**. Every usage:

| Location | Purpose | Manual authz? | Risk |
|----------|---------|---------------|------|
| `getAvailableSlotsAction` | Public slot RPC | **None** — anyone who knows `businessId`+`serviceId` UUIDs can call `/api/slots` | **Medium** — intentional for public booking; IDs are secrets-of-obscurity |
| `getAvailableDatesAction` | Public date probing (loops RPC) | **None** | Same |
| `createBookingCheckout` | Client upsert + booking insert | **None** (public booking by design) | **Accepted** — validate slot + service belonging to business |
| `deleteClient` | Delete bookings then client | Checks `business_id === own.id` after `requireUser` | **OK** |
| `ensureBusinessAssetsBucket` / upload retry | Storage bucket create | Behind `requireUser` in `uploadBusinessAsset` | **OK** |
| `booking/success/page.tsx` | Load booking for public success UI | **None** — any `booking_id` UUID | **Medium** — UUID guessability; no session |
| `booking-confirmed/page.tsx` | Load booking after confirm | **None** | Same |

Regular `createClient()` (server/browser) is used for dashboard, onboarding auth gate, and public business-by-slug reads (RLS-enforced).

---

## 7. Dead / fallback code (expected, not a bug)

- `BookingWidget` + `src/lib/booking/availability.ts` (+ `mock-appointments` pattern inside availability) are used when `salon.id` is falsy — i.e. demo slug from `getSalonBySlug` without a Supabase business (`luxury-black-gold/index.tsx` line 33).
- **Keep as intentional demo fallback.** Do not “clean up” without replacing the demo salon path.

---

## Additional findings (out of requested sections)

1. **`getServiceDurationMinutes("30 min")` quirk** — regex treats leading number as hours → `1800` minutes. Only affects demo `BookingWidget`, not RPC. Covered in unit test comments.
2. **Zero-deposit path** skips `notify-stylist` and goes straight to confirmed success UI — confirm product intent.
3. **Migrations 003/004** must be applied on environments that still have enum `hair_texture` or lack confirmation columns; app code already assumes those columns exist.
4. **Stripe** removed from app code (audit Part C); `stripe_payment_intent_id` column remains unused in app logic — expected.

---

## Summary scorecard

| Flow | Status |
|------|--------|
| Onboarding persist paths | Pass (manual dashboard link on step 4, not auto-redirect) |
| Public booking + deadline + payment screen | Pass (token depends on DB default) |
| notify-stylist + confirm-booking link | Pass (function present; deploy/env required) |
| Client cancel | Pass (built) |
| Dashboard complete → DB trigger | Pass |
| Admin client without authz | Flagged for public slot + public booking-id pages |
| Demo BookingWidget fallback | Expected |

---

*Generated as a code-trace QA deliverable. Fixes should be scoped as separate tasks.*
