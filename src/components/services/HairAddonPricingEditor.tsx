"use client";

import { useRef, useState, useTransition } from "react";
import type { HairAddonPriceEntry } from "@/types/database";
import { uploadBusinessAsset } from "@/lib/actions/business";
import { currencySymbol } from "@/lib/format";

interface HairAddonPricingEditorProps {
  rows: HairAddonPriceEntry[];
  onChange: (rows: HairAddonPriceEntry[]) => void;
}

/** Strip inch marks for the numeric input; keep digits only. */
function lengthNumericPart(stored: string): string {
  return stored.replace(/["″]/g, "").replace(/[^\d.]/g, "").trim();
}

/** Persist length with a trailing inch mark for compatibility with existing rows. */
function lengthWithInches(numeric: string): string {
  const n = lengthNumericPart(numeric);
  return n ? `${n}"` : "";
}

export function HairAddonPricingEditor({
  rows,
  onChange,
}: HairAddonPricingEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  // Stable row keys — never derive from length/texture (that remounts inputs on type).
  const rowKeysRef = useRef<string[]>([]);
  while (rowKeysRef.current.length < rows.length) {
    rowKeysRef.current.push(
      `row-${Date.now()}-${rowKeysRef.current.length}-${Math.random().toString(36).slice(2, 9)}`
    );
  }
  if (rowKeysRef.current.length > rows.length) {
    rowKeysRef.current = rowKeysRef.current.slice(0, rows.length);
  }

  function updateRow(index: number, patch: Partial<HairAddonPriceEntry>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    rowKeysRef.current = rowKeysRef.current.filter((_, i) => i !== index);
    onChange(rows.filter((_, i) => i !== index));
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

  const currencyHint = currencySymbol();

  return (
    <div className="min-w-0 space-y-3 rounded-2xl border border-[#E8E0D8] bg-[#FAF8F5]/50 p-3 sm:p-4">
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
            key={rowKeysRef.current[index]}
            className="min-w-0 space-y-3 rounded-xl border border-[#E8E0D8] bg-white p-3"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(5.5rem,auto)_auto] sm:items-end">
              <label className="block min-w-0">
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#9C8E86]">
                  Length
                </span>
                <div className="flex min-h-11 min-w-0 items-stretch overflow-hidden rounded-xl border border-[#E8E0D8] bg-white focus-within:border-[#B8956E] focus-within:ring-2 focus-within:ring-[#B8956E]/20">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    value={lengthNumericPart(row.length)}
                    onChange={(e) =>
                      updateRow(index, {
                        length: lengthWithInches(e.target.value),
                      })
                    }
                    placeholder="18"
                    className="box-border min-h-11 w-full min-w-0 border-0 bg-transparent px-3 py-2.5 text-base outline-none sm:text-sm"
                    aria-label="Length in inches"
                  />
                  <span
                    className="flex shrink-0 items-center border-l border-[#E8E0D8] bg-[#FAF8F5] px-3 text-sm text-[#6B5E58]"
                    aria-hidden
                  >
                    &quot;
                  </span>
                </div>
              </label>
              <label className="block min-w-0">
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#9C8E86]">
                  Texture
                </span>
                <input
                  type="text"
                  value={row.texture}
                  onChange={(e) => updateRow(index, { texture: e.target.value })}
                  placeholder="Texture"
                  className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] bg-white px-3 py-2.5 text-base sm:text-sm"
                  aria-label="Texture"
                />
              </label>
              <label className="block min-w-0">
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#9C8E86]">
                  Price ({currencyHint})
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={row.price}
                  onChange={(e) =>
                    updateRow(index, { price: Number(e.target.value) })
                  }
                  className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] bg-white px-3 py-2.5 text-base sm:text-sm"
                  aria-label="Price"
                />
              </label>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="min-h-11 shrink-0 justify-self-start px-3 text-xs text-[#9C8E86] hover:text-[#1A1614] sm:justify-self-auto sm:px-2 sm:pb-3"
              >
                Remove
              </button>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              {row.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.image_url}
                  alt=""
                  className="h-12 w-10 shrink-0 rounded-lg object-cover ring-1 ring-[#E8E0D8]"
                />
              ) : (
                <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F5] text-[9px] text-[#9C8E86] ring-1 ring-[#E8E0D8]">
                  —
                </div>
              )}
              <label className="min-w-0 flex-1 text-xs text-[#6B5E58]">
                <span className="mb-1 block font-medium text-[#B8956E]">
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
                  className="block w-full max-w-full text-xs"
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
                  className="min-h-11 shrink-0 text-xs text-[#9C8E86] hover:text-[#1A1614]"
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
        onClick={() => {
          rowKeysRef.current.push(
            `row-${Date.now()}-${rowKeysRef.current.length}-${Math.random().toString(36).slice(2, 9)}`
          );
          onChange([
            ...rows,
            { length: '18"', texture: "body-wavy", price: 120 },
          ]);
        }}
        className="min-h-11 text-xs font-semibold uppercase tracking-wider text-[#B8956E]"
      >
        + Add row
      </button>
    </div>
  );
}
