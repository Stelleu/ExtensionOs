function friendlyAuthError(raw: string | undefined): string | null {
  if (!raw) return null;
  const msg = decodeURIComponent(raw).toLowerCase();

  if (msg === "invalid" || msg.includes("invalid login")) {
    return "Email or password is incorrect.";
  }
  if (msg.includes("rate limit")) {
    return "Too many signup emails sent. Wait a few minutes, or in Supabase → Authentication → Providers → Email, turn OFF “Confirm email” for local development.";
  }
  if (msg.includes("already registered") || msg.includes("already been registered")) {
    return "This email is already registered. Try signing in instead.";
  }
  if (msg.includes("confirm") || msg.includes("verify")) {
    return "Check your inbox to confirm your email, then sign in. For local dev, disable “Confirm email” in Supabase Auth settings.";
  }
  if (msg.includes("password")) {
    return "Password must be at least 8 characters.";
  }

  return decodeURIComponent(raw);
}

export function AuthError({ error }: { error?: string }) {
  const message = friendlyAuthError(error);
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {message}
    </div>
  );
}
