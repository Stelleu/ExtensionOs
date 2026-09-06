import type { SalonProfile } from "@/types/salon";

interface FooterProps {
  salon: SalonProfile;
}

export function Footer({ salon }: FooterProps) {
  return (
    <footer className="border-t border-[#E5DDD4] py-14">
      <div className="mx-auto max-w-6xl px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#2C2825]">
              {salon.businessName}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#9C9088]">
              {salon.city}
            </p>
          </div>

          <p className="text-xs text-[#9C9088]">
            © {new Date().getFullYear()} {salon.businessName}
          </p>

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A897]/70">
            Powered by HairBoss AI
          </p>
        </div>
      </div>
    </footer>
  );
}
