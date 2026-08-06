import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1A1614]">
      <header className="px-6 py-6 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
          HairBoss AI
        </p>
      </header>

      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-6 py-24 lg:px-10">
        <h1 className="font-serif text-5xl leading-tight lg:text-6xl">
          Your salon site,{" "}
          <span className="italic text-[#B8956E]">ready in minutes</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[#6B5E58]">
          AI-powered websites for hair extension specialists. Booking with live
          availability, deposits, and client management — no code needed.
        </p>

        <div className="mt-10">
          <Link
            href="/luxehairlondon"
            className="inline-flex items-center justify-center rounded-full bg-[#1A1614] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#B8956E] hover:shadow-xl"
          >
            View demo template
          </Link>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-8 shadow-[0_4px_40px_-12px_rgba(26,22,20,0.1)] ring-1 ring-[#1A1614]/5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9C8E86]">
            Template 1 of 3 · Redesigned
          </p>
          <p className="mt-2 font-serif text-2xl">Luxury Black &amp; Gold</p>
          <p className="mt-2 text-sm text-[#6B5E58]">
            Airy, editorial layout with Calendly-style booking. Demo:{" "}
            <span className="text-[#B8956E]">Luxe Hair London</span>
          </p>
        </div>
      </main>
    </div>
  );
}
