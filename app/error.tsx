"use client";

import Image from "next/image";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Portal error boundary:", error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-md">
      <div className="card w-full max-w-md space-y-lg text-center">
        <Image
          src="/logo.png"
          alt="RABS logo"
          width={56}
          height={56}
          className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-surface-container-low"
        />
        <div className="space-y-xs">
          <h1 className="font-display text-headline-md text-on-surface">
            Something went wrong
          </h1>
          <p className="text-body-md text-on-surface-variant">
            An unexpected error occurred while loading this page.
            {error.digest && (
              <span className="mt-xs block text-body-sm text-on-surface-variant/70">
                Error code: {error.digest}
              </span>
            )}
          </p>
        </div>
        <button type="button" onClick={reset} className="btn-primary w-full">
          Try again
        </button>
      </div>
    </div>
  );
}