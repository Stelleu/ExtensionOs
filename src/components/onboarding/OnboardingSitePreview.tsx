"use client";

import { useEffect, useRef } from "react";
import type { SalonProfile } from "@/types/salon";

const MOBILE_PREVIEW_WIDTH = 390;

export function OnboardingSitePreview({ salon }: { salon: SalonProfile }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function postSalon() {
      iframe?.contentWindow?.postMessage(
        { type: "onboarding-preview", salon },
        window.location.origin
      );
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!iframe || event.source !== iframe.contentWindow) return;
      if (event.data?.type === "preview-frame-ready") postSalon();
    }

    window.addEventListener("message", onMessage);
    iframe.addEventListener("load", postSalon);
    postSalon();

    return () => {
      window.removeEventListener("message", onMessage);
      iframe.removeEventListener("load", postSalon);
    };
  }, [salon]);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5">
      <div className="flex items-center justify-between border-b border-[#E8E0D8] bg-[#FAF8F5] px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B8956E]">
          Mobile preview
        </p>
        <span className="text-[10px] uppercase tracking-wider text-[#9C8E86]">
          {MOBILE_PREVIEW_WIDTH}px
        </span>
      </div>
      <div className="flex justify-center bg-[#E8E0D8]/25 px-4 py-6">
        <iframe
          ref={iframeRef}
          src="/onboarding/preview-frame"
          title="Mobile site preview"
          className="h-[min(75vh,760px)] w-full max-w-[390px] rounded-[1.75rem] bg-white shadow-[inset_0_0_0_1px_rgba(26,22,20,0.08)] ring-1 ring-[#1A1614]/10"
          style={{ maxWidth: MOBILE_PREVIEW_WIDTH }}
        />
      </div>
    </div>
  );
}
