import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) redirect("/onboarding");

  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/bookings", label: "Bookings" },
    { href: "/dashboard/clients", label: "Clients" },
    { href: "/dashboard/revenue", label: "Revenue" },
    { href: "/dashboard/services", label: "Services" },
    { href: "/dashboard/availability", label: "Availability" },
    { href: "/dashboard/settings", label: "Profile" },
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#FAF8F5]">
      <header className="border-b border-[#E8E0D8] bg-white">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B8956E]">
              ExtensionOS
            </p>
            <p className="truncate font-serif text-lg text-[#1A1614]">
              {business.name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="inline-flex min-h-11 items-center rounded-full bg-[#1A1614] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white sm:px-4 sm:text-[11px]"
            >
              Public page
            </Link>
            <form action={signOut} className="hidden sm:block">
              <button
                type="submit"
                className="min-h-11 px-2 text-[11px] uppercase tracking-wider text-[#9C8E86]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav
          className="-mx-0 flex gap-1 overflow-x-auto border-t border-[#E8E0D8] px-3 py-2 md:mx-auto md:max-w-6xl md:flex-wrap md:overflow-visible md:px-6"
          aria-label="Dashboard"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#6B5E58] hover:bg-[#FAF8F5] hover:text-[#1A1614]"
            >
              {l.label}
            </Link>
          ))}
          <form action={signOut} className="sm:hidden">
            <button
              type="submit"
              className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 py-2 text-[11px] uppercase tracking-wider text-[#9C8E86]"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
