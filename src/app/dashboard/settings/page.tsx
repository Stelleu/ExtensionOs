import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BusinessProfileForm } from "@/components/dashboard/BusinessProfileForm";
import type { Business } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  return (
    <div>
      <h1 className="font-serif text-4xl text-[#1A1614]">Business profile</h1>
      <p className="mt-2 text-sm text-[#6B5E58]">
        Contact details used on your public page and in client emails.
      </p>
      <div className="mt-8">
        <BusinessProfileForm business={business as Business} />
      </div>
    </div>
  );
}
