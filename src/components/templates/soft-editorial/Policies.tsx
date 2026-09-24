import type { SalonProfile } from "@/types/salon";

interface PoliciesProps {
  salon: SalonProfile;
}

export function Policies({ salon }: PoliciesProps) {
  const items = [
    { title: "Deposits", content: salon.policies.deposit },
    { title: "Cancellation", content: salon.policies.cancellation },
    { title: "Aftercare", content: salon.policies.aftercare },
  ];

  return (
    <section className="border-t border-[#E5DDD4] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {items.map((item) => (
            <div key={item.title} className="border-t border-[#E5DDD4] pt-8">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A897]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#7A726A]">
                {item.content}
              </p>
            </div>
          ))}
        </div>
        {salon.loyaltyNote ? (
          <p className="mt-12 text-center text-xs text-[#9C9088]">
            {salon.loyaltyNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
