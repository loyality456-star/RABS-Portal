import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/portal";

export const dynamic = "force-dynamic";

const categorySchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).default(""),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    await requireAdmin();
    const { id } = await params;
    const body = categorySchema.parse(await req.json());

    const exists = await queryOne<{ id: string }>(
      "SELECT id FROM categories WHERE id = ?",
      [id]
    );
    if (!exists) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    let slug = slugify(body.name);
    const conflict = await queryOne<{ id: string }>(
      "SELECT id FROM categories WHERE slug = ? AND id != ?",
      [slug, id]
    );
    if (conflict) slug = `${slug}-${id.slice(0, 6)}`;

    await execute(
      "UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?",
      [body.name.trim(), slug, body.description, id]
    );

    return NextResponse.json({ ok: true, slug });
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
    console.error("PATCH /api/admin/categories/[id]", err);
    return NextResponse.json({ error: "Could not update category." }, { status: 500 });
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
    await execute(
      "UPDATE products SET category_id = NULL WHERE category_id = ?",
      [id]
    );
    const result = await execute("DELETE FROM categories WHERE id = ?", [id]);
    if (Number(result.rowsAffected) === 0) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("DELETE /api/admin/categories/[id]", err);
    return NextResponse.json({ error: "Could not delete category." }, { status: 500 });
  }
}