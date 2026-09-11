import { redirect } from "next/navigation";
import { ensureSchema, getSessionUser } from "@/lib/auth";
import PortalShell from "@/app/(portal)/PortalShell";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureSchema();
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <PortalShell username={user.username}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </PortalShell>
  );
}