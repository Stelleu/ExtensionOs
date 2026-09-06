"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOrUpdateBusiness,
  uploadBusinessAsset,
} from "@/lib/actions/business";
import type { Business } from "@/types/database";
import {
  HAIR_TEXTURE_SUBTYPE_GROUPS,
  parseHairTypePhotos,
  type HairTextureSubtype,
} from "@/lib/salon-helpers";
import { HairTypeIcon } from "@/components/booking/HairTypeIcon";

export function HairTypeGallerySection({ business }: { business: Business }) {
  const router = useRouter();
  const [photos, setPhotos] = useState(() =>
    parseHairTypePhotos(business.hair_type_photos)
  );
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function persist(next: Record<string, string>) {
    setPhotos(next);
    startTransition(async () => {
      try {
        await createOrUpdateBusiness({
          name: business.name,
          tagline: business.tagline ?? undefined,
          bio: business.bio ?? undefined,
          instagram: business.instagram ?? undefined,
          phone: business.phone ?? undefined,
          email: business.email ?? undefined,
          location: business.location ?? undefined,
          logo_url: business.logo_url,
          hero_image_url: business.hero_image_url,
          template_id: business.template_id ?? undefined,
          hair_type_photos: next,
        });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save photos");
      }
    });
  }

  async function handleUpload(subtype: HairTextureSubtype, file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError(null);
    setUploading(subtype);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", "hair-types");
      fd.set("subtype", subtype);
      const { url } = await uploadBusinessAsset(fd);
      persist({ ...photos, [subtype]: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function clearPhoto(subtype: HairTextureSubtype) {
    const next = { ...photos };
    delete next[subtype];
    persist(next);
  }

  return (
    <div className="space-y-4 rounded-3xl bg-white p-8 ring-1 ring-[#1A1614]/5">
      <div>
        <h2 className="font-serif text-2xl text-[#1A1614]">Hair type gallery</h2>
        <p className="mt-1 text-sm text-[#6B5E58]">
          Optional. Upload a photo for any hair type to replace the default
          illustration on your booking page.
        </p>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {pending && (
        <p className="text-xs text-[#9C8E86]">Saving gallery…</p>
      )}
      <div className="space-y-6">
        {HAIR_TEXTURE_SUBTYPE_GROUPS.map((group) => (
          <div key={group.family}>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]">
              {group.label}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {group.subtypes.map((subtype) => {
                const url = photos[subtype];
                return (
                  <div
                    key={subtype}
                    className="rounded-2xl border border-[#E8E0D8] p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-14 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#FAF8F5]">
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <HairTypeIcon subtype={subtype} />
                        )}
                      </div>
                      <span className="text-sm font-medium uppercase">
                        {subtype}
                      </span>
                    </div>
                    <label className="block text-xs text-[#6B5E58]">
                      <span className="text-[#B8956E]">
                        {uploading === subtype
                          ? "Uploading…"
                          : url
                            ? "Change photo"
                            : "Upload photo"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!!uploading}
                        className="mt-1 block w-full text-xs"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void handleUpload(subtype, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {url && (
                      <button
                        type="button"
                        onClick={() => clearPhoto(subtype)}
                        className="mt-2 text-[10px] uppercase tracking-wider text-[#9C8E86]"
                      >
                        Use default illustration
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
