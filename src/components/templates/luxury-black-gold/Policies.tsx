import type { SalonProfile } from "@/types/salon";

interface PoliciesProps {
  salon: SalonProfile;
}

export function Policies({ salon }: PoliciesProps) {
  const items = [
    { title: "Deposits", content: salon.policies.deposit, icon: "💳" },
    { title: "Cancellation", content: salon.policies.cancellation, icon: "📅" },
    { title: "Aftercare", content: salon.policies.aftercare, icon: "✨" },
  ];

  return (
    <section className="border-y border-[#E8E0D8] bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="text-center md:text-left">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8956E]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6B5E58]">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
