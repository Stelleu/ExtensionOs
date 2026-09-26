"use client";

import { useMemo, useState } from "react";
import {
  resolveRecommendations,
  pricingRowsForRecommendations,
  type HairTextureSubtype,
  type HairThickness,
} from "@/lib/salon-helpers";
import { NaturalHairIntake } from "@/components/booking/NaturalHairIntake";
import { HairAddonCarousel } from "@/components/booking/HairAddonCard";
import { compareSalon } from "@/lib/theme-compare-fixture";

/** Isolated UI harness for natural-hair → recommendation → addon order. */
export default function BookingHairPreviewPage() {
  const salon = compareSalon("luxury-black-gold");
  const service = salon.services.find((s) => s.requiresHairAddon)!;
  const hairAddonRows = service.hairAddonPricing ?? [];
  const availableAddonTextures = [
    ...new Set(hairAddonRows.map((r) => r.texture)),
  ];

  const [wantsHairAddon, setWantsHairAddon] = useState(true);
  const [hairLength, setHairLength] = useState(hairAddonRows[0]?.length ?? "");
  const [hairTexture, setHairTexture] = useState(
    hairAddonRows[0]?.texture ?? ""
  );
  const [naturalTextureSubtype, setNaturalTextureSubtype] = useState<
    HairTextureSubtype | ""
  >("");
  const [naturalThickness, setNaturalThickness] = useState<HairThickness | "">(
    ""
  );
  const [naturalChemicalTreatment, setNaturalChemicalTreatment] = useState<
    boolean | null
  >(null);
  const [naturalHairNotes, setNaturalHairNotes] = useState("");
  const [name, setName] = useState("Test Client");
  const [email, setEmail] = useState("test@example.com");
  const [phone, setPhone] = useState("+44 7700 900000");

  const recommendedTextures = useMemo(
    () =>
      naturalTextureSubtype
        ? resolveRecommendations(
            naturalTextureSubtype,
            service.hairTypeRecommendations,
            availableAddonTextures
          )
        : [],
    [
      naturalTextureSubtype,
      service.hairTypeRecommendations,
      availableAddonTextures,
    ]
  );

  function applyRecommendedAddon(subtype: HairTextureSubtype) {
    const recs = resolveRecommendations(
      subtype,
      service.hairTypeRecommendations,
      availableAddonTextures
    );
    const matched = pricingRowsForRecommendations(recs, hairAddonRows);
    if (matched[0]) {
      setHairLength(matched[0].length);
      setHairTexture(matched[0].texture);
    }
  }

  return (
    <div className="mx-auto min-w-0 max-w-lg overflow-x-hidden bg-[#FAF8F5] p-4 sm:p-6">
      <h1 className="font-serif text-2xl text-[#1A1614]">
        Hair addon flow preview
      </h1>
      <p className="mt-1 text-sm text-[#9C8E86]">
        Service: {service.name}
      </p>

      <div className="mt-6 min-w-0 space-y-3 rounded-2xl border border-[#E8E0D8] bg-white p-4">
        <label className="flex min-w-0 items-start gap-3 text-sm text-[#1A1614]">
          <input
            type="checkbox"
            checked={wantsHairAddon}
            onChange={(e) => setWantsHairAddon(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#B8956E]"
          />
          <span className="min-w-0 flex-1">I need hair supplied</span>
        </label>

        {wantsHairAddon && (
          <>
            <NaturalHairIntake
              textureSubtype={naturalTextureSubtype}
              thickness={naturalThickness}
              chemicalTreatment={naturalChemicalTreatment}
              notes={naturalHairNotes}
              hairTypeRecommendations={service.hairTypeRecommendations}
              hairTypePhotos={salon.hairTypePhotos}
              availableTextures={availableAddonTextures}
              onTextureChange={(subtype) => {
                setNaturalTextureSubtype(subtype);
                applyRecommendedAddon(subtype);
              }}
              onThicknessChange={setNaturalThickness}
              onChemicalTreatmentChange={setNaturalChemicalTreatment}
              onNotesChange={setNaturalHairNotes}
            />
            <HairAddonCarousel
              entries={hairAddonRows}
              selectedLength={hairLength}
              selectedTexture={hairTexture}
              recommendedTextures={recommendedTextures}
              onSelect={(length, texture) => {
                setHairLength(length);
                setHairTexture(texture);
              }}
            />
          </>
        )}
      </div>

      <div className="mt-8 min-w-0 space-y-3 rounded-2xl border border-[#E8E0D8] bg-white p-4">
        <p className="text-sm font-medium text-[#1A1614]">Contact (confirm)</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="box-border w-full min-w-0 rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
          aria-label="Full name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="box-border w-full min-w-0 rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
          aria-label="Email"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="box-border w-full min-w-0 rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
          aria-label="Phone"
        />
        <p className="text-center text-xs leading-relaxed break-words text-[#9C8E86]">
          Please double-check your name, email, and phone number — your booking
          confirmation and all updates will be sent by email.
        </p>
        <button
          type="button"
          className="box-border w-full max-w-full rounded-full bg-[#1A1614] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white sm:tracking-[0.2em]"
        >
          Confirm booking
        </button>
        <p className="text-xs text-[#9C8E86]">
          Selection: {hairLength} · {hairTexture} · type{" "}
          {naturalTextureSubtype || "—"} · {naturalThickness || "—"} · chem{" "}
          {naturalChemicalTreatment === null
            ? "—"
            : naturalChemicalTreatment
              ? "yes"
              : "no"}
        </p>
      </div>
    </div>
  );
}
