"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createService, updateService } from "@/lib/actions/business";
import type { HairAddonPriceRow, Service } from "@/types/database";
import { formatPrice } from "@/lib/format";
import {
  DEFAULT_HAIR_ADDON_PRICING,
  parseHairAddonPricing,
} from "@/lib/salon-helpers";
import { HairAddonPricingEditor } from "@/components/services/HairAddonPricingEditor";

const emptyForm = {
  name: "",
  base_price: 100,
  deposit_amount: 30,
  duration_minutes: 120,
  requires_hair_addon: false,
  is_extension_service: true,
  hair_addon_pricing: [] as HairAddonPriceRow[],
};

export function ServicesManager({
  businessId,
  initialServices,
}: {
  businessId: string;
  initialServices: Service[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createService({
        business_id: businessId,
        ...form,
        hair_addon_pricing: form.requires_hair_addon
          ? form.hair_addon_pricing
          : [],
      });
      setShowForm(false);
      setForm(emptyForm);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-[#1A1614]">Services</h1>
          <p className="mt-2 text-sm text-[#6B5E58]">
            Consultation forms are auto-generated on create/update.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-[#1A1614] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white"
        >
          {showForm ? "Cancel" : "Add service"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onCreate}
          className="mt-6 space-y-3 rounded-2xl bg-white p-6 ring-1 ring-[#1A1614]/5"
        >
          <ServiceFields form={form} setForm={setForm} />
          <button
            type="submit"
            disabled={pending || !form.name}
            className="rounded-full bg-[#B8956E] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40"
          >
            {pending ? "Saving…" : "Create"}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {initialServices.map((s) => (
          <ServiceRow key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}

function ServiceFields({
  form,
  setForm,
}: {
  form: typeof emptyForm;
  setForm: (form: typeof emptyForm) => void;
}) {
  return (
    <>
      <input
        required
        placeholder="Service name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm"
      />
      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-[#9C8E86]">Price (£)</span>
          <input
            type="number"
            min={0}
            value={form.base_price}
            onChange={(e) =>
              setForm({ ...form, base_price: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[#9C8E86]">Deposit (£)</span>
          <input
            type="number"
            min={0}
            value={form.deposit_amount}
            onChange={(e) =>
              setForm({ ...form, deposit_amount: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[#9C8E86]">
            Duration (min)
          </span>
          <input
            type="number"
            min={15}
            value={form.duration_minutes}
            onChange={(e) =>
              setForm({ ...form, duration_minutes: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.requires_hair_addon}
          onChange={(e) => {
            const checked = e.target.checked;
            setForm({
              ...form,
              requires_hair_addon: checked,
              hair_addon_pricing:
                checked && form.hair_addon_pricing.length === 0
                  ? DEFAULT_HAIR_ADDON_PRICING
                  : form.hair_addon_pricing,
            });
          }}
        />
        Requires hair addon
      </label>
      {form.requires_hair_addon && (
        <HairAddonPricingEditor
          rows={form.hair_addon_pricing}
          onChange={(hair_addon_pricing) =>
            setForm({ ...form, hair_addon_pricing })
          }
        />
      )}
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_extension_service}
          onChange={(e) =>
            setForm({ ...form, is_extension_service: e.target.checked })
          }
        />
        Extension service (6-week reminder)
      </label>
    </>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: service.name,
    base_price: Number(service.base_price),
    deposit_amount: Number(service.deposit_amount),
    duration_minutes: service.duration_minutes,
    requires_hair_addon: service.requires_hair_addon,
    is_extension_service: service.is_extension_service,
    hair_addon_pricing: parseHairAddonPricing(service.hair_addon_pricing),
  });

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateService(service.id, {
        ...form,
        hair_addon_pricing: form.requires_hair_addon
          ? form.hair_addon_pricing
          : [],
      });
      setEditing(false);
      router.refresh();
    });
  }

  if (editing) {
    return (
      <form
        onSubmit={onSave}
        className="space-y-3 rounded-2xl bg-white p-6 ring-1 ring-[#1A1614]/5"
      >
        <ServiceFields form={form} setForm={setForm} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-full border border-[#E8E0D8] px-4 py-2 text-[11px] uppercase tracking-wider text-[#6B5E58]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || !form.name}
            className="rounded-full bg-[#1A1614] px-4 py-2 text-[11px] uppercase tracking-wider text-white disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-[#1A1614]/5">
      <div>
        <p className="font-medium text-[#1A1614]">{service.name}</p>
        <p className="text-sm text-[#6B5E58]">
          {formatPrice(Number(service.base_price))} · {service.duration_minutes}{" "}
          min · deposit {formatPrice(Number(service.deposit_amount))}
          {!service.active && " · inactive"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-[#E8E0D8] px-4 py-2 text-[11px] uppercase tracking-wider text-[#6B5E58]"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await updateService(service.id, { active: !service.active });
              router.refresh();
            })
          }
          className="rounded-full border border-[#E8E0D8] px-4 py-2 text-[11px] uppercase tracking-wider text-[#6B5E58]"
        >
          {service.active ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
}
