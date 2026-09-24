import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientsList } from "@/components/dashboard/ClientsList";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select(
      "id, loyalty_enabled, loyalty_visits_required, loyalty_discount_percent"
    )
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  // Never bulk-export health_notes — only show on single-client detail
  const { data: clients } = await supabase
    .from("clients")
    .select(
      "id, name, email, phone, visit_count, health_notes_consent, image_consent, created_at"
    )
    .eq("business_id", business.id)
    .order("name", { ascending: true });

  return (
    <div>
      <h1 className="font-serif text-4xl text-[#1A1614]">Clients</h1>
      <p className="mt-2 text-sm text-[#6B5E58]">
        Health notes are only visible on individual booking cards, never in
        lists or exports.
      </p>
      <ClientsList
        clients={clients ?? []}
        loyalty={
          business.loyalty_enabled
            ? {
                enabled: true,
                visitsRequired: business.loyalty_visits_required ?? 5,
                discountPercent: business.loyalty_discount_percent ?? 10,
              }
            : null
        }
      />
    </div>
  );
}
