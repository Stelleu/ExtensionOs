import { NextResponse } from "next/server";
import {
  getAvailableDatesAction,
  getAvailableSlotsAction,
} from "@/lib/actions/business";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const mode = searchParams.get("mode") || "slots";

  if (!businessId || !serviceId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    if (mode === "dates") {
      const dates = await getAvailableDatesAction(businessId, serviceId);
      return NextResponse.json({ dates });
    }

    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const slots = await getAvailableSlotsAction(businessId, serviceId, date);
    return NextResponse.json({ slots });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
