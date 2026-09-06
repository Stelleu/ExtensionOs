"use client";

import { useEffect, useState } from "react";
import { SalonTemplate } from "@/components/templates/SalonTemplate";
import type { SalonProfile } from "@/types/salon";

export default function OnboardingPreviewFramePage() {
  const [salon, setSalon] = useState<SalonProfile | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "onboarding-preview" || !event.data.salon) return;
      setSalon(event.data.salon as SalonProfile);
    }

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "preview-frame-ready" }, "*");

    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!salon) {
    return <div className="min-h-screen bg-[#FAF8F5]" aria-hidden />;
  }

  return <SalonTemplate salon={salon} />;
}
