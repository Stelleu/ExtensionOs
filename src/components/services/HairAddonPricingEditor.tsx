"use client";

import { useState, useTransition } from "react";
import type { HairAddonPriceEntry } from "@/types/database";
import { uploadBusinessAsset } from "@/lib/actions/business";

interface HairAddonPricingEditorProps {
  rows: HairAddonPriceEntry[];
  onChange: (rows: HairAddonPriceEntry[]) => void;
}

export function HairAddonPricingEditor({
  rows,
  onChange,
}: HairAddonPricingEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function updateRow(index: number, patch: Partial<HairAddonPriceEntry>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function handlePhoto(index: number, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError(null);
    setUploadingIndex(index);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("kind", "hair-addons");
        const { url } = await uploadBusinessAsset(fd);
        updateRow(index, { image_url: url });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploadingIndex(null);
      }
    });
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[#E8E0D8] bg-[#FAF8F5]/50 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
        Hair addon pricing
      </p>
      <p className="text-xs text-[#6B5E58]">
        Clients only see combinations you list here. Optional photos appear in
        the booking carousel.
      </p>
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={`${row.length}-${row.texture}-${index}`}
            className="space-y-2 rounded-xl border border-[#E8E0D8] bg-white p-3"
          >
            <div className="grid grid-cols-[1fr_1fr_5rem_auto] items-center gap-2">
              <input
                type="text"
                value={row.length}
                onChange={(e) => updateRow(index, { length: e.target.value })}
                placeholder='Length (e.g. 18")'
                className="rounded-xl border border-[#E8E0D8] bg-white px-3 py-2 text-sm"
                aria-label="Length"
              />
              <input
                type="text"
                value={row.texture}
                onChange={(e) => updateRow(index, { texture: e.target.value })}
                placeholder="Texture"
                className="rounded-xl border border-[#E8E0D8] bg-white px-3 py-2 text-sm"
                aria-label="Texture"
              />
              <input
                type="number"
                min={0}
                value={row.price}
                onChange={(e) =>
                  updateRow(index, { price: Number(e.target.value) })
                }
                className="rounded-xl border border-[#E8E0D8] bg-white px-3 py-2 text-sm"
                aria-label="Price"
              />
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
                className="text-xs text-[#9C8E86] hover:text-[#1A1614]"
              >
                Remove
              </button>
            </div>
            <div className="flex items-center gap-3">
              {row.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.image_url}
                  alt=""
                  className="h-12 w-10 rounded-lg object-cover ring-1 ring-[#E8E0D8]"
                />
              ) : (
                <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-[#FAF8F5] text-[9px] text-[#9C8E86] ring-1 ring-[#E8E0D8]">
                  —
                </div>
              )}
              <label className="text-xs text-[#6B5E58]">
                <span className="mr-2 font-medium text-[#B8956E]">
                  {uploadingIndex === index
                    ? "Uploading…"
                    : row.image_url
                      ? "Change photo"
                      : "Add photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingIndex !== null}
                  className="text-xs"
                  onChange={(e) => {
                    handlePhoto(index, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {row.image_url && (
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      rows.map((r, i) =>
                        i === index
                          ? {
                              length: r.length,
                              texture: r.texture,
                              price: r.price,
                            }
                          : r
                      )
                    )
                  }
                  className="text-xs text-[#9C8E86] hover:text-[#1A1614]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,
            { length: '18"', texture: "body-wavy", price: 120 },
          ])
        }
        className="text-xs font-semibold uppercase tracking-wider text-[#B8956E]"
      >
        + Add row
      </button>
    </div>
  );
}
