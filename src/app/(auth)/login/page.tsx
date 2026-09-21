import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

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

        <LoginForm initialError={error} />

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
