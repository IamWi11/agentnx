"use client";

import { Turnstile } from "@marsidev/react-turnstile";

interface Props {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export default function TurnstileWidget({ onSuccess, onExpire, onError }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If no key is configured (local dev), auto-pass so the form still works
  if (!siteKey) {
    if (typeof window !== "undefined") onSuccess("dev-bypass");
    return null;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onExpire={onExpire}
      onError={onError}
      options={{ theme: "dark", size: "normal" }}
    />
  );
}
