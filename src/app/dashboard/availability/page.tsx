import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AvailabilityManager } from "@/components/dashboard/AvailabilityManager";
import type { Availability, BlockedTime } from "@/types/database";
import { DEFAULT_CANCELLATION_POLICY } from "@/lib/salon-helpers";

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, minimum_booking_notice_hours, cancellation_policy")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("business_id", business.id)
    .order("day_of_week")
    .order("start_time");

  const { data: blocked } = await supabase
    .from("blocked_times")
    .select("*")
    .eq("business_id", business.id)
    .order("date", { ascending: true });

  return (
    <AvailabilityManager
      businessId={business.id}
      initialAvailability={(availability as Availability[]) ?? []}
      initialBlocked={(blocked as BlockedTime[]) ?? []}
      initialNoticeHours={business.minimum_booking_notice_hours ?? 24}
      initialCancellationPolicy={
        business.cancellation_policy || DEFAULT_CANCELLATION_POLICY
      }
    />
  );
}
