"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOrUpdateBusiness,
  uploadBusinessAsset,
} from "@/lib/actions/business";
import type { Business } from "@/types/database";
import { parseGalleryUrls } from "@/lib/salon-helpers";

export function GalleryManagerSection({ business }: { business: Business }) {
  const router = useRouter();
  const [urls, setUrls] = useState(() => parseGalleryUrls(business.gallery_urls));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function persist(next: string[]) {
    setUrls(next);
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
          gallery_urls: next,
        });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save gallery");
      }
    });
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", "gallery");
      fd.set("business_id", business.id);
      const { url } = await uploadBusinessAsset(fd);
      persist([...urls, url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    persist(urls.filter((_, i) => i !== index));
  }

  return (
    <section className="min-w-0 space-y-4 overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-[#1A1614]/5 sm:p-8">
      <div>
        <h2 className="font-serif text-2xl text-[#1A1614]">Gallery</h2>
        <p className="mt-1 text-sm text-[#6B5E58]">
          Photos shown on your public page. Leave empty to hide the gallery
          section.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {(uploading || pending) && (
        <p className="text-xs text-[#9C8E86]">
          {uploading ? "Uploading…" : "Saving gallery…"}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {urls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-[#FAF8F5]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              disabled={pending || uploading}
              className="absolute right-2 top-2 min-h-9 rounded-full bg-[#1A1614]/85 px-3 text-[10px] font-semibold uppercase tracking-wider text-white opacity-100 transition-opacity disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
            >
              Remove
            </button>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8E0D8] bg-[#FAF8F5]/50 text-center transition-colors hover:border-[#B8956E]/50">
          <span className="text-xs font-medium text-[#6B5E58]">
            {uploading ? "Uploading…" : "Add photo"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading || pending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </section>
  );
}
