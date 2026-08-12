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
    { href: "/dashboard/services", label: "Services" },
    { href: "/dashboard/availability", label: "Availability" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="border-b border-[#E8E0D8] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B8956E]">
              HairBoss AI
            </p>
            <p className="font-serif text-lg text-[#1A1614]">{business.name}</p>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#6B5E58] hover:text-[#1A1614]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="rounded-full bg-[#1A1614] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white"
            >
              Public page
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-[11px] uppercase tracking-wider text-[#9C8E86]"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
