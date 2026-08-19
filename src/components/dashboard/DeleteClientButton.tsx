"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteClient } from "@/lib/actions/business";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Permanently delete this client and their bookings?")) return;
        startTransition(async () => {
          await deleteClient(clientId);
          router.refresh();
        });
      }}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete data"}
    </button>
  );
}
