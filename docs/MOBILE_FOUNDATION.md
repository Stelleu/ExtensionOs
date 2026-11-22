# ExtensionOs mobile foundation

## Product rules to preserve

- The existing web booking journey remains available to clients.
- Clients do not need an ExtensionOs account to book.
- Transactional emails remain enabled as an auditable booking record. Push notifications are additive, never a replacement.
- If a stylist requests a deposit, it is mandatory for the booking to become confirmed.
- A deposit booking remains `pending_payment` until the stylist has manually verified receipt and confirms it from an authenticated ExtensionOs session.
- The client pays through the external payment link configured by the stylist. Do not add payment processing or infer payment receipt from a redirect.
- If the deposit deadline expires before confirmation, the booking must not become confirmed; the existing expiry/cancellation behavior must be preserved and verified.
- The booking confirmation page should offer an `Add to calendar` action using a portable calendar event (ICS), without requiring a client account.

## Current architecture constraints

The application is a Next.js 16 App Router project using React 19 and Supabase. It uses server-side functionality (including Server Actions and Supabase service-role operations), so a static export is not a safe Capacitor target. Do not enable `output: export` or move privileged booking logic into the mobile client.

The deployed Next.js application must remain the trusted server for booking mutations, authorization, email delivery, and any future push dispatch.

## Mobile integration principles

1. Keep the current web application and public booking URLs working.
2. Use Capacitor for native iOS and Android capabilities; do not assume the Next.js application can be statically exported.
3. Before selecting the production WebView delivery model, verify how the deployed Next.js server, authentication cookies/session refresh, deep links, and Server Actions behave inside the native app. Capacitor's development `server.url` setting must not be treated as a production architecture by default.
4. Store device push tokens on the server, associate them with an authenticated stylist account, and send pushes only from trusted server-side code. Never expose APNs/FCM credentials or Supabase service-role keys to the app.
5. A push tap should deep-link to the relevant booking. The booking page must re-check the current authenticated user, business ownership, booking status, and deadline before allowing manual deposit confirmation.
6. Keep client push optional. Client booking and email confirmations must work without a client account, app install, or push permission.
7. Generate calendar events from the confirmed booking's canonical date, time, duration, service, and salon location. Avoid putting private client details in public URLs.
8. Add and test native capabilities incrementally; do not change deposit, booking, or email behavior as part of the initial Capacitor shell setup.

## Delivery sequence

- [ ] Audit Next.js deployment/runtime, Supabase auth, booking flows, and existing email/expiry jobs.
- [ ] Choose and document the production Capacitor WebView architecture compatible with Next.js server features.
- [ ] Add Capacitor core/CLI and platform projects on the feature branch, keeping the lockfile in sync.
- [ ] Validate login/session persistence, external links, file uploads, and deep-link routing on iOS and Android.
- [ ] Add authenticated stylist push-token registration and server-side push delivery.
- [ ] Add push tap routing to the pending booking and preserve the manual deposit confirmation gate.
- [ ] Add an ICS calendar action to the client confirmation flow.
- [ ] Verify emails remain enabled and client booking still works without an account.
- [ ] Run lint, unit tests, build, and device smoke tests before opening a pull request.

## Explicit non-goals

- No static export of the existing Next.js application.
- No integrated card processing, payment webhook, or automatic deposit confirmation.
- No mandatory client account.
- No removal of transactional emails.
- No automatic confirmation merely because a client opened or returned from the external payment link.
