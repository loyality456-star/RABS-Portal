import { NextResponse } from "next/server";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, requireAdmin } from "@/lib/auth";
import type { AdminUser } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    const me = await requireAdmin();
    const { id } = await params;

    if (id === me.id) {
      return NextResponse.json(
        { error: "You cannot remove your own account." },
        { status: 400 }
      );
    }

    const target = await queryOne<AdminUser>(
      "SELECT * FROM admin_users WHERE id = ?",
      [id]
    );
    if (!target) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    await execute("DELETE FROM admin_users WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("DELETE /api/admin/admins/[id]", err);
    return NextResponse.json({ error: "Could not remove admin." }, { status: 500 });
  }
}