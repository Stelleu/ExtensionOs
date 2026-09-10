import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { AuthError } from "@/components/auth/AuthError";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#FAF8F5] px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full min-w-0 max-w-md rounded-3xl bg-white p-5 shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#B8956E]">
          ExtensionOS
        </p>
        <h1 className="mt-3 font-serif text-2xl text-[#1A1614] sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-[#6B5E58]">
          Sign in to your salon dashboard
        </p>

        <div className="mt-6">
          <AuthError error={error} />
        </div>

        <form action={signIn} className="space-y-4">
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
            className="min-h-11 w-full rounded-full bg-[#1A1614] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#B8956E]"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#6B5E58]">
          New here?{" "}
          <Link href="/signup" className="text-[#B8956E] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
