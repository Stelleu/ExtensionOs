import type { SalonProfile } from "@/types/salon";

interface FooterProps {
  salon: SalonProfile;
}

export function Footer({ salon }: FooterProps) {
  return (
    <footer className="bg-[#FAF8F5] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1614] font-serif text-xs text-white">
              {salon.logoInitials}
            </div>
            <div>
              <p className="font-serif text-lg text-[#1A1614]">{salon.businessName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9C8E86]">{salon.city}</p>
            </div>
          </div>

          <p className="text-xs text-[#9C8E86]">
            © {new Date().getFullYear()} {salon.businessName}
          </p>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C4B8B0]">
            Powered by <span className="text-[#B8956E]">HairBoss AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
