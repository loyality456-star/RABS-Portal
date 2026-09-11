import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, requireAdmin } from "@/lib/auth";
import type { Review } from "@/lib/schema";

export const dynamic = "force-dynamic";

const replySchema = z.object({ reply: z.string().min(1).max(5000) });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    await requireAdmin();
    const { id } = await params;
    const { reply } = replySchema.parse(await req.json());

    const review = await queryOne<Review>(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );
    if (!review) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    await execute(
      "UPDATE reviews SET reply = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?",
      [reply, id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    console.error("POST /api/admin/reviews/[id]/reply", err);
    return NextResponse.json({ error: "Could not save reply." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    await requireAdmin();
    const { id } = await params;

    const review = await queryOne<Review>(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );
    if (!review) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    await execute("DELETE FROM reviews WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("DELETE /api/admin/reviews/[id]/reply", err);
    return NextResponse.json({ error: "Could not delete review." }, { status: 500 });
  }
}