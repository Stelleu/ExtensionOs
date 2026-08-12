import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DeleteClientButton } from "@/components/dashboard/DeleteClientButton";

export default async function ClientsPage() {
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

  // Never bulk-export health_notes — only show on single-client detail
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, email, phone, visit_count, health_notes_consent, created_at")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-4xl text-[#1A1614]">Clients</h1>
      <p className="mt-2 text-sm text-[#6B5E58]">
        Health notes are only visible on individual booking cards — never in
        lists or exports.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-[#1A1614]/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E8E0D8] text-[10px] uppercase tracking-wider text-[#9C8E86]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">GDPR</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((c) => (
              <tr key={c.id} className="border-b border-[#E8E0D8]/60">
                <td className="px-4 py-3 font-medium text-[#1A1614]">{c.name}</td>
                <td className="px-4 py-3 text-[#6B5E58]">
                  {c.email}
                  {c.phone ? ` · ${c.phone}` : ""}
                </td>
                <td className="px-4 py-3">{c.visit_count}</td>
                <td className="px-4 py-3">
                  <DeleteClientButton clientId={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!clients || clients.length === 0) && (
          <p className="p-8 text-center text-sm text-[#9C8E86]">No clients yet.</p>
        )}
      </div>
    </div>
  );
}
