"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Prefer configured public URL; fall back to the request host (Netlify). */
async function getAppUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
    return configured;
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  if (host) return `${proto.split(",")[0].trim()}://${host}`;

  return configured || "http://localhost:3000";
}

function redirectSignupError(message: string): never {
  redirect(`/signup?error=${encodeURIComponent(message)}`);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password || password.length < 8) {
    redirectSignupError("invalid");
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    )
  ) {
    redirectSignupError(
      "Server misconfigured: missing Supabase URL or anon key on Netlify."
    );
  }

  try {
    const supabase = await createClient();
    const appUrl = await getAppUrl();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/onboarding`,
      },
    });

    if (error) {
      redirectSignupError(error.message);
    }

    // Email confirmation enabled → no session until user clicks the link
    if (!data.session) {
      redirectSignupError("confirm your email before continuing");
    }

    redirect("/onboarding");
  } catch (err) {
    // `redirect()` throws a special Next.js error — rethrow it.
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest?: unknown }).digest === "string" &&
      String((err as { digest: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }

    const message =
      err instanceof Error ? err.message : "Signup failed. Please try again.";
    redirectSignupError(message);
  }
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_id", data.user.id)
      .maybeSingle();

    redirect(business ? "/dashboard" : "/onboarding");
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest?: unknown }).digest === "string" &&
      String((err as { digest: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    const message =
      err instanceof Error ? err.message : "Sign in failed. Please try again.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
