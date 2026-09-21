"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthError } from "@/components/auth/AuthError";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    startTransition(async () => {
      setError(undefined);
      try {
        const supabase = createClient();
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        const { data: business } = await supabase
          .from("businesses")
          .select("id")
          .eq("owner_id", data.user.id)
          .maybeSingle();

        router.replace(business ? "/dashboard" : "/onboarding");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Sign in failed. Please try again."
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
            autoComplete="current-password"
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] bg-[#FAF8F5]/50 px-4 py-3 text-base outline-none focus:border-[#B8956E]"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full rounded-full bg-[#1A1614] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#B8956E] disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </>
  );
}
