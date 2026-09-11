import { AdminsManager } from "@/components/AdminsManager";
import { ensureSchema, getSessionUser, listAdmins } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  await ensureSchema();
  const user = await getSessionUser();
  const admins = await listAdmins();

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Admins</h1>
        <p className="mt-xs text-body-md text-on-surface-variant">
          Create new admin accounts. Each password is automatically hashed with
          scrypt before it reaches the database.
        </p>
      </div>
      <AdminsManager admins={admins} currentUserId={user?.id ?? ""} />
    </div>
  );
}