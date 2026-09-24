import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RevenueDashboard } from "@/components/dashboard/RevenueDashboard";
import { parseRevenueRows } from "@/lib/revenue";

export default async function RevenuePage() {
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

  const { data, error } = await supabase.rpc("get_revenue_by_month", {
    p_business_id: business.id,
    p_months: 6,
  });

  if (error) {
    return (
      <div>
        <h1 className="font-serif text-4xl text-[#1A1614]">Revenue</h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load revenue: {error.message}
        </p>
      </div>
    );
  }

  return <RevenueDashboard months={parseRevenueRows(data)} />;
}
