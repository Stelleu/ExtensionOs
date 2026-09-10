"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOrUpdateBusiness,
  uploadBusinessAsset,
} from "@/lib/actions/business";
import type { Business } from "@/types/database";
import type { TemplateId } from "@/types/salon";
import { normalizeTemplateId } from "@/lib/templates";
import { ThemePicker } from "@/components/templates/ThemePicker";

export function BusinessProfileForm({ business }: { business: Business }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "hero" | null>(null);
  const [profile, setProfile] = useState({
    name: business.name ?? "",
    tagline: business.tagline ?? "",
    bio: business.bio ?? "",
    instagram: business.instagram ?? "",
    phone: business.phone ?? "",
    email: business.email ?? "",
    location: business.location ?? "",
    logo_url: business.logo_url,
    hero_image_url: business.hero_image_url,
    template_id: normalizeTemplateId(business.template_id),
  });

  async function handleUpload(file: File, kind: "logo" | "hero") {
    setUploading(kind);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", kind);
      const { url } = await uploadBusinessAsset(fd);
      setProfile((p) =>
        kind === "logo" ? { ...p, logo_url: url } : { ...p, hero_image_url: url }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await createOrUpdateBusiness({
          ...profile,
          template_id: profile.template_id,
        });
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save profile");
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="min-w-0 space-y-4 overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-[#1A1614]/5 sm:p-8"
    >
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Saved.
        </p>
      )}
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Business name
        </span>
        <input
          required
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Tagline
        </span>
        <input
          value={profile.tagline}
          onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
          className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Bio
        </span>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
          className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
            Email
          </span>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="hello@yoursalon.com"
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
            Phone
          </span>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
            Instagram
          </span>
          <input
            value={profile.instagram}
            onChange={(e) =>
              setProfile({ ...profile, instagram: e.target.value })
            }
            placeholder="@yoursalon"
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
            Location
          </span>
          <input
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
            className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:text-sm"
          />
        </label>
      </div>
      <ThemePicker
        value={profile.template_id}
        onChange={(template_id) => setProfile({ ...profile, template_id })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
            Logo
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={!!uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleUpload(f, "logo");
            }}
            className="w-full text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
            Hero image
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={!!uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleUpload(f, "hero");
            }}
            className="w-full text-sm"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending || !profile.name || !!uploading}
        className="rounded-full bg-[#1A1614] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-40"
      >
        {uploading ? "Uploading…" : pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
