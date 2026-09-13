import { accountCreationAllowed } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const params = await searchParams;
  let showCreate = false;
  try {
    showCreate = await accountCreationAllowed();
  } catch {
    showCreate = false;
  }

  return (
    <LoginForm
      showCreate={showCreate}
      notice={params.setup === "locked" ? "Admin accounts are managed by existing admins. Please sign in." : undefined}
    />
  );
}