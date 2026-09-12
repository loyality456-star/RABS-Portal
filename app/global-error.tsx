"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Portal global error:", error);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-surface font-sans text-body-md text-on-surface antialiased">
        <div className="card w-full max-w-md space-y-lg text-center p-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
              <path
                d="M12 22C12 22 3.5 16.5 3.5 9.5A8.5 8.5 0 0 1 12 3c3.5 4 4 8.5 8.5 8.5 1.2 0 2.4-.3 3.4-.9C20.9 19 12 22 12 22Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="space-y-xs">
            <h1 className="font-display text-headline-md text-on-surface">
              RABS Portal hiccup
            </h1>
            <p className="text-body-md text-on-surface-variant">
              A serious error occurred.
              {error.digest && (
                <span className="mt-xs block text-body-sm text-on-surface-variant/70">
                  Error code: {error.digest}
                </span>
              )}
            </p>
          </div>
          <button type="button" onClick={reset} className="btn-primary w-full">
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}