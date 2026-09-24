"use client";

import { useMemo, useState } from "react";
import { DeleteClientButton } from "@/components/dashboard/DeleteClientButton";

export type ClientListItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  visit_count: number;
  image_consent: boolean;
};

export function ClientsList({ clients }: { clients: ClientListItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, query]);

  return (
    <div className="mt-8 space-y-4">
      <label className="block">
        <span className="sr-only">Search clients</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          className="box-border min-h-11 w-full min-w-0 rounded-xl border border-[#E8E0D8] bg-white px-4 py-3 text-base outline-none focus:border-[#B8956E] sm:max-w-sm sm:text-sm"
        />
      </label>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-[#1A1614]/5">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-[#E8E0D8] text-[10px] uppercase tracking-wider text-[#9C8E86]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">GDPR</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-[#E8E0D8]/60">
                <td className="px-4 py-3 font-medium text-[#1A1614]">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-[#6B5E58]">
                  {c.email}
                  {c.phone ? ` · ${c.phone}` : ""}
                </td>
                <td className="px-4 py-3">{c.visit_count}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        c.image_consent
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#FAF8F5] text-[#9C8E86]"
                      }`}
                    >
                      Image use: {c.image_consent ? "allowed" : "not allowed"}
                    </span>
                    <DeleteClientButton clientId={c.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-[#9C8E86]">
            {clients.length === 0
              ? "No clients yet."
              : "No clients match your search."}
          </p>
        )}
      </div>
    </div>
  );
}
