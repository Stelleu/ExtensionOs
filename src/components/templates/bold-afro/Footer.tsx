import type { SalonProfile } from "@/types/salon";

interface FooterProps {
  salon: SalonProfile;
}

export function Footer({ salon }: FooterProps) {
  return (
    <footer className="bg-[#1B4332] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8A849] text-xs font-bold text-[#1B4332]">
              {salon.logoInitials}
            </div>
            <div>
              <p className="text-lg font-bold text-[#FFF8F0]">{salon.businessName}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8A849]/70">
                {salon.city}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#FFF8F0]/50">
            © {new Date().getFullYear()} {salon.businessName}
          </p>

          <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8A849]/60">
            Powered by ExtensionOS
          </p>
        </div>
      </div>
    </footer>
  );
}
