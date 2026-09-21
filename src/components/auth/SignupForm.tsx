"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthError } from "@/components/auth/AuthError";

export function SignupForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    if (!email || !password || password.length < 8) {
      setError("invalid");
      return;
    }

    startTransition(async () => {
      setError(undefined);
      try {
        const supabase = createClient();
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL || "";

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/onboarding`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (!data.session) {
          setError("confirm your email before continuing");
          return;
        }

        router.replace("/onboarding");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Signup failed. Please try again."
        );
      }
    });
  }

  return (
    <>
      <div className="mt-6">
        <AuthError error={error} />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
            Email
          </span>
          <input
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] bg-[#FAF8F5]/50 px-4 py-3 text-base outline-none focus:border-[#B8956E]"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] bg-[#FAF8F5]/50 px-4 py-3 text-base outline-none focus:border-[#B8956E]"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full rounded-full bg-[#1A1614] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#B8956E] disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </>
  );
}
