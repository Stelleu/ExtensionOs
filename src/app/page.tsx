import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1A1614]">
      <header className="flex items-center justify-between px-6 py-6 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
          HairBoss AI
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B5E58]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#1A1614] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
          >
            Start free
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-6 py-24 lg:px-10">
        <h1 className="font-serif text-5xl leading-tight lg:text-6xl">
          Your salon site,{" "}
          <span className="italic text-[#B8956E]">ready in minutes</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[#6B5E58]">
          AI-powered websites for hair extension specialists. Live availability
          booking, deposits, and client management — no Calendly needed.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-[#1A1614] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#B8956E]"
          >
            Create your salon
          </Link>
          <Link
            href="/luxehairlondon"
            className="inline-flex items-center justify-center rounded-full border border-[#1A1614] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#1A1614]"
          >
            View demo
          </Link>
        </div>
      </main>
    </div>
  );
}
