import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  AppointmentCard,
  type AppointmentCardBooking,
} from "@/components/dashboard/AppointmentCard";
import {
  PendingPaymentCard,
  type PendingPaymentBooking,
} from "@/components/dashboard/PendingPaymentCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug, name")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  const today = new Date().toISOString().slice(0, 10);

  const { data: pendingPayments } = await supabase
    .from("bookings")
    .select(
      "*, clients(id, name), services(id, name)"
    )
    .eq("business_id", business.id)
    .eq("status", "pending_payment")
    .order("confirmation_deadline", { ascending: true });

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "*, clients(id, name, visit_count, health_notes, health_notes_consent, image_consent), services(id, name)"
    )
    .eq("business_id", business.id)
    .gte("appointment_date", today)
    .eq("status", "confirmed")
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })
    .limit(20);

  const { count: clientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id);

  const { count: serviceCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[#1A1614]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6B5E58]">
            Upcoming appointments for {business.name}
          </p>
        </div>
        <Link
          href={`/${business.slug}`}
          className="text-sm text-[#B8956E] hover:underline"
        >
          hairboss.app/{business.slug} →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Upcoming" value={String(bookings?.length ?? 0)} />
        <Stat
          label="Awaiting payment"
          value={String(pendingPayments?.length ?? 0)}
        />
        <Stat label="Clients" value={String(clientCount ?? 0)} href="/dashboard/clients" />
        <Stat label="Services" value={String(serviceCount ?? 0)} href="/dashboard/services" />
      </div>

      <h2 className="mt-12 font-serif text-2xl text-[#1A1614]">
        Awaiting payment confirmation
      </h2>
      <p className="mt-1 text-sm text-[#6B5E58]">
        Deposits are confirmed via the link in your email — not from this screen.
      </p>
      <div className="mt-6 grid gap-4">
        {(pendingPayments as PendingPaymentBooking[] | null)?.map((b) => (
          <PendingPaymentCard key={b.id} booking={b} />
        ))}
        {(!pendingPayments || pendingPayments.length === 0) && (
          <p className="rounded-2xl border border-dashed border-[#E8E0D8] p-8 text-center text-sm text-[#9C8E86]">
            No bookings awaiting deposit confirmation.
          </p>
        )}
      </div>

      <h2 className="mt-12 font-serif text-2xl text-[#1A1614]">
        Upcoming appointments
      </h2>
      <div className="mt-6 grid gap-4">
        {(bookings as AppointmentCardBooking[] | null)?.map((b) => (
          <AppointmentCard key={b.id} booking={b} />
        ))}
        {(!bookings || bookings.length === 0) && (
          <p className="rounded-2xl border border-dashed border-[#E8E0D8] p-8 text-center text-sm text-[#9C8E86]">
            No upcoming bookings yet. Share your public page to get your first
            booking.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-[#1A1614]/5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9C8E86]">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl text-[#1A1614]">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
