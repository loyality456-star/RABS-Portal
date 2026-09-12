import Image from "next/image";
import Link from "next/link";

export function DbSetupScreen({
  message = "The database is not reachable yet.",
}: {
  message?: string;
}) {
  const missingEnv = !process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-md">
      <div className="card w-full max-w-lg space-y-lg text-center">
        <Image
          src="/logo.png"
          alt="RABS logo"
          width={56}
          height={56}
          className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-surface-container-low"
        />
        <div className="space-y-xs">
          <h1 className="font-display text-headline-md text-on-surface">
            Portal not connected yet
          </h1>
          <p className="text-body-md text-on-surface-variant">{message}</p>
        </div>

        <div className="rounded-[0.5rem] border border-outline-variant bg-surface-container-low p-md text-left text-body-sm text-on-surface-variant space-y-xs">
          {missingEnv ? (
            <>
              <p className="font-semibold text-on-surface">
                Missing environment variables.
              </p>
              <p>
                Create a <code className="rounded bg-surface-container px-xs py-[2px]">.env.local</code> file
                in the <code className="rounded bg-surface-container px-xs py-[2px]">RABS-Portal</code> folder with:
              </p>
              <pre className="overflow-x-auto whitespace-pre rounded-[0.5rem] bg-on-surface p-sm text-body-sm text-surface">
{`TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
JWT_SECRET=any-random-secret`}
              </pre>
              <p>
                Then restart with <code className="rounded bg-surface-container px-xs py-[2px]">npm run preview</code>.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-on-surface">
                Turso is configured but unreachable.
              </p>
              <p>
                Check that your database token is valid, your URL is correct,
                and the tables exist (run the schema from SETUP.md in the Turso
                SQL shell). See the server log for the exact error.
              </p>
            </>
          )}
        </div>

        <p className="text-body-sm text-on-surface-variant">
          Need guidance? Read{" "}
          <Link
            href="https://github.com/Talib-ILM/RABS-Portal/blob/main/SETUP.md"
            className="text-primary underline underline-offset-2"
          >
            SETUP.md
          </Link>{" "}
          for full Turso + Vercel instructions.
        </p>
      </div>
    </div>
  );
}