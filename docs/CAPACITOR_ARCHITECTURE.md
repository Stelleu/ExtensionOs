# Capacitor architecture decision record

Date: 2026-11-22
Branch: feat/capacitor-mobile-foundation

## Findings from the repository audit

- Next.js 16.2.12, React 19.2.4, TypeScript 5.
- Supabase SSR is used in browser and server clients; session refresh is handled by middleware and cookies.
- The app relies on App Router server features and Server Actions. It is not a static SPA.
- Netlify configuration is present; the production domain is referenced in Next.js Server Action allowed origins as `extensionos.fr` and `www.extensionos.fr`.
- There is an existing package-lock.json, so dependency changes must be made with npm and committed together with the regenerated lockfile.
- The Capacitor 8 line is the current stable major. Official installation documentation requires a package.json and a separate web assets directory containing an index.html. Capacitor's `server.url` setting is documented for live reload and explicitly not intended for production.

## Product scope for the first native app

The first native app is stylist-facing. The client booking journey remains on the public website and clients do not need an ExtensionOs account or app install. Client emails remain enabled. Client calendar export is a web booking-confirmation feature.

The native app must support authenticated stylist access, open a booking from a push tap, and let the stylist manually confirm receipt of a deposit. The server must continue to enforce user authentication, business ownership, booking state, and deposit deadline.

## Architecture recommendation

Do not wrap the deployed Next.js website by setting Capacitor's `server.url` to the production domain. Official Capacitor config docs say this option is intended for live reload, not production. Do not enable Next.js static export: the current app depends on server execution.

Recommended production direction:

1. Keep the existing Next.js application on Netlify as the trusted backend and existing web product.
2. Create a dedicated mobile frontend in a separate workspace (for example `apps/mobile`) using a bundler that emits local static web assets with an `index.html`, then package that frontend with Capacitor.
3. Share visual tokens and domain types where practical, but keep authorization and all privileged data mutations on the server.
4. Add narrow authenticated API endpoints in the existing Next.js app for mobile-specific needs (first: current stylist session/profile and booking list/detail; later: push token registration and deposit confirmation). Each endpoint must use the Supabase server client and explicitly verify the authenticated user's business ownership.
5. Keep the current public booking website and email delivery paths unchanged.
6. Implement push registration only after APNs/FCM credentials and token lifecycle are configured. Store tokens per authenticated stylist/device; never expose service-role or provider credentials to the app.
7. Use deep links/universal links so a notification opens the booking detail route in the app, with a web fallback.

This is a deliberate staged approach. It avoids pretending a server-rendered Next.js app is a static Capacitor bundle and avoids depending on a production `server.url` workaround.

## Capacitor toolchain baseline

- Use the stable Capacitor 8 release line, with matching versions for `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, and `@capacitor/android`.
- Capacitor 8 requires Node.js 22 or newer.
- On macOS, iOS builds require Xcode. Android builds require Android Studio and its SDK; Android Studio supplies the JDK.
- Check the installed Node version with `node --version` before dependency installation.
- Keep package.json and package-lock.json in the same commit. Do not edit the lockfile by hand.

## Immediate implementation sequence

- [ ] Confirm the Mac has Node.js 22+ and Xcode installed.
- [ ] Scaffold the dedicated mobile workspace and its local static web entry point.
- [ ] Install matching Capacitor 8 dependencies and regenerate package-lock.json with npm.
- [ ] Add iOS and Android native projects.
- [ ] Build a minimal stylist login/session screen and verify Supabase auth against the deployed server.
- [ ] Add authenticated booking list/detail API endpoints.
- [ ] Add deep-link routing and then push token registration.
- [ ] Add server-side push dispatch for deposit bookings, preserving the manual confirmation gate.
- [ ] Run build, lint, tests, and native smoke tests.

## Important existing booking behavior

The existing QA audit records that deposit bookings are inserted as `pending_payment`, use the stylist-configured external payment link, and are manually confirmed through the existing confirmation flow. Do not infer deposit receipt from a payment redirect. Do not remove or replace transactional emails. Deadline expiry must leave the booking unconfirmed and follow the existing cancellation/expiry path.
