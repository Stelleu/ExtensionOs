/**
 * Server-only helper. Do not import from client components —
 * uses SUPABASE_SERVICE_ROLE_KEY.
 */
export async function invokeEdgeFunction(
  name: string,
  payload: object
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !serviceKey) {
    console.error(`Edge function ${name}: missing Supabase env`);
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`Edge function ${name} failed (${res.status}): ${detail}`);
    }
  } catch (err) {
    console.error(`Edge function ${name} error:`, err);
  }
}
