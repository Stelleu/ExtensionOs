export function emailLayout(input: {
  title: string;
  intro: string;
  rows?: { label: string; value: string }[];
  sections?: { heading: string; body: string }[];
  ctaUrl?: string;
  ctaLabel?: string;
  linkUrl?: string;
  linkLabel?: string;
  footer?: string;
}): string {
  const rowsHtml = (input.rows ?? [])
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 0;color:#9C8E86;font-size:14px;width:120px;vertical-align:top;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 0;color:#1A1614;font-size:14px;font-weight:500;">${escapeHtml(row.value)}</td>
        </tr>`
    )
    .join("");

  const ctaHtml =
    input.ctaUrl && input.ctaLabel
      ? `
        <p style="margin:28px 0 0;text-align:center;">
          <a href="${escapeHtml(input.ctaUrl)}"
             style="display:inline-block;background:#1A1614;color:#FFFFFF;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;padding:16px 32px;border-radius:999px;">
            ${escapeHtml(input.ctaLabel)}
          </a>
        </p>`
      : "";

  const linkHtml =
    input.linkUrl && input.linkLabel
      ? `
        <p style="margin:20px 0 0;text-align:center;">
          <a href="${escapeHtml(input.linkUrl)}"
             style="color:#B8956E;font-size:13px;text-decoration:underline;">
            ${escapeHtml(input.linkLabel)}
          </a>
        </p>`
      : "";

  const sectionsHtml = (input.sections ?? [])
    .map(
      (section) => `
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #E8E0D8;">
          <h2 style="margin:0 0 8px;font-size:16px;line-height:1.4;color:#1A1614;font-weight:600;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(section.heading)}</h2>
          <p style="margin:0;color:#6B5E58;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${escapeHtml(section.body)}</p>
        </div>`
    )
    .join("");

  const footer = input.footer
    ? `<p style="margin:24px 0 0;color:#9C8E86;font-size:12px;line-height:1.6;">${escapeHtml(input.footer)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#FAF8F5;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF8F5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 8px 60px -12px rgba(26,22,20,0.12);border:1px solid rgba(26,22,20,0.05);">
            <tr>
              <td style="padding:32px 32px 20px;text-align:center;background:#FAF8F5;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:#B8956E;">ExtensionOS</p>
                <h1 style="margin:0;font-size:28px;line-height:1.25;color:#1A1614;font-weight:400;">${escapeHtml(input.title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px;color:#6B5E58;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0 0 16px;">${escapeHtml(input.intro)}</p>
                ${
                  rowsHtml
                    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;border-top:1px solid #E8E0D8;">${rowsHtml}</table>`
                    : ""
                }
                ${sectionsHtml}
                ${ctaHtml}
                ${linkHtml}
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function brandedPage(input: {
  title: string;
  message: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FAF8F5;font-family:Georgia,'Times New Roman',serif;padding:24px;">
    <div style="max-width:420px;width:100%;background:#FFFFFF;border-radius:24px;padding:40px 32px;text-align:center;box-shadow:0 8px 60px -12px rgba(26,22,20,0.12);border:1px solid rgba(26,22,20,0.05);">
      <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:#B8956E;">ExtensionOS</p>
      <h1 style="margin:0 0 16px;font-size:28px;color:#1A1614;font-weight:400;">${escapeHtml(input.title)}</h1>
      <p style="margin:0;color:#6B5E58;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.message)}</p>
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
