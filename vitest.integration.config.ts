import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Integration tests hit a real Supabase project (service role).
 * Run only against a dedicated test/staging database — never production
 * with real client data.
 *
 * Env (same names as the app):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
