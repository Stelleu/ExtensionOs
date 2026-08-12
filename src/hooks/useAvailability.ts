"use client";

import { useEffect, useState } from "react";

/** Fetch available dates for a business/service via get_available_slots RPC. */
export function useAvailableDates(
  businessId: string | undefined,
  serviceId: string | null
) {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || !serviceId) {
      setDates([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `/api/slots?mode=dates&businessId=${businessId}&serviceId=${serviceId}`
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed");
        setDates(data.dates ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [businessId, serviceId]);

  return { dates, loading, error };
}

export function useAvailableSlots(
  businessId: string | undefined,
  serviceId: string | null,
  date: string | null
) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || !serviceId || !date) {
      setSlots([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `/api/slots?businessId=${businessId}&serviceId=${serviceId}&date=${date}`
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed");
        setSlots(data.slots ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [businessId, serviceId, date]);

  return { slots, loading, error };
}
