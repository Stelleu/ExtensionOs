import { emailLayout } from "./html.ts";

const RESEND_API = "https://api.resend.com/emails";

function fromAddress(): string {
  return Deno.env.get("RESEND_FROM_EMAIL") ?? "HairBoss AI <onboarding@resend.dev>";
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend error (${res.status}): ${detail}`);
  }
}

export async function sendTemplatedEmail(input: {
  to: string;
  subject: string;
  title: string;
  intro: string;
  rows?: { label: string; value: string }[];
  sections?: { heading: string; body: string }[];
  ctaUrl?: string;
  ctaLabel?: string;
  linkUrl?: string;
  linkLabel?: string;
  footer?: string;
}): Promise<void> {
  const html = emailLayout({
    title: input.title,
    intro: input.intro,
    rows: input.rows,
    sections: input.sections,
    ctaUrl: input.ctaUrl,
    ctaLabel: input.ctaLabel,
    linkUrl: input.linkUrl,
    linkLabel: input.linkLabel,
    footer: input.footer,
  });
  await sendEmail({ to: input.to, subject: input.subject, html });
}
