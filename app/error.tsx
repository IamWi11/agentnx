"use client";

import { useEffect } from "react";
import Link from "next/link";

// Global error boundary for the Next.js App Router.
// Catches render/runtime errors in any route segment and shows a safe fallback
// instead of a crashed white page. Critical for live demos (VA May 12).

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side digest lets us correlate without leaking error details to users.
    console.error("[error-boundary]", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
        Something went wrong
      </h1>
      <p style={{ color: "#666", maxWidth: "28rem", marginBottom: "1.5rem" }}>
        An unexpected error occurred. Our team has been notified. Try again, or
        return home to continue.
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={() => reset()}
          style={{
            background: "#0f172a",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            background: "transparent",
            color: "#0f172a",
            border: "1px solid #0f172a",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.375rem",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          Go home
        </Link>
      </div>
      {error.digest && (
        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#999" }}>
          Error reference: {error.digest}
        </p>
      )}
    </div>
  );
}
