import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  AppointmentCard,
  type AppointmentCardBooking,
} from "@/components/dashboard/AppointmentCard";

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "*, clients(id, name, visit_count, health_notes, health_notes_consent), services(id, name)"
    )
    .eq("business_id", business.id)
    .order("appointment_date", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-serif text-4xl text-[#1A1614]">Bookings</h1>
      <p className="mt-2 text-sm text-[#6B5E58]">
        Mark completed to trigger loyalty + 6-week maintenance (DB trigger).
      </p>
      <div className="mt-8 grid gap-4">
        {(bookings as AppointmentCardBooking[] | null)?.map((b) => (
          <AppointmentCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}
