"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BackToTopVariant = "luxury" | "soft" | "bold";

const VARIANT_CLASS: Record<BackToTopVariant, string> = {
  luxury:
    "rounded-full bg-[#1A1614] text-white shadow-lg hover:bg-[#B8956E]",
  soft:
    "rounded-none border border-[#2C2825] bg-[#FAF6F1] text-[#2C2825] shadow-sm hover:bg-[#2C2825] hover:text-white",
  bold:
    "rounded-2xl bg-[#1B4332] text-[#E8A849] shadow-lg hover:scale-105",
};

export function BackToTopButton({
  variant,
  threshold = 480,
}: {
  variant: BackToTopVariant;
  /** Scroll Y (px) before the button appears — roughly past the hero. */
  threshold?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-5 right-4 z-40 flex min-h-11 min-w-11 items-center justify-center px-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all sm:bottom-8 sm:right-8",
        VARIANT_CLASS[variant]
      )}
    >
      Top
    </button>
  );
}
