import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!baseUrl || !serviceKey) {
    return new NextResponse("Service unavailable", { status: 503 });
  }

  const upstream = await fetch(
    `${baseUrl}/functions/v1/cancel-booking/${encodeURIComponent(token)}`,
    {
      method: "GET",
      redirect: "manual",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );

  const headers = new Headers();
  const location = upstream.headers.get("location");
  if (location) headers.set("location", location);
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
