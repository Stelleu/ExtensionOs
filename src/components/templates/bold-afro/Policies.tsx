import type { SalonProfile } from "@/types/salon";

interface PoliciesProps {
  salon: SalonProfile;
}

export function Policies({ salon }: PoliciesProps) {
  const items = [
    { title: "Deposits", content: salon.policies.deposit, color: "bg-[#C45C3E]" },
    { title: "Cancellation", content: salon.policies.cancellation, color: "bg-[#1B4332]" },
    { title: "Aftercare", content: salon.policies.aftercare, color: "bg-[#E8A849] text-[#1B4332]" },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl p-8 text-[#FFF8F0] ${item.color}`}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed opacity-90">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
