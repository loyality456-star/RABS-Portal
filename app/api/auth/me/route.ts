import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ensureSchema } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSchema();
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ id: user.id, username: user.username });
}