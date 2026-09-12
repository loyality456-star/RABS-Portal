import { redirect } from "next/navigation";
import { ensureSchema, getSessionUser } from "@/lib/auth";
import PortalShell from "@/app/(portal)/PortalShell";
import { DbSetupScreen } from "@/components/DbSetupScreen";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: Awaited<ReturnType<typeof getSessionUser>> = null;

  try {
    await ensureSchema();
    user = await getSessionUser();
  } catch (err) {
    console.error("Portal layout DB failure:", err);
    return (
      <DbSetupScreen
        message={
          err instanceof Error
            ? `The database could not be reached (${err.message}). Please check your Turso configuration.`
            : "The database could not be reached."
        }
      />
    );
  }

  if (!user) redirect("/login");

  return (
    <PortalShell username={user.username}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </PortalShell>
  );
}