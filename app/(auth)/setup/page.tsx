import { redirect } from "next/navigation";
import { accountCreationAllowed } from "@/lib/auth";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  let allowed = false;
  try {
    allowed = await accountCreationAllowed();
  } catch {
    allowed = false;
  }

  if (!allowed) redirect("/login?setup=locked");

  return <SetupForm />;
}