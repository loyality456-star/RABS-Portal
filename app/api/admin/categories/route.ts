import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, newId, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/portal";

export const dynamic = "force-dynamic";

const categorySchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).default(""),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    await requireAdmin();
    const body = categorySchema.parse(await req.json());

    let slug = slugify(body.name);
    if (!slug) slug = newId();
    const conflict = await queryOne<{ id: string }>(
      "SELECT id FROM categories WHERE slug = ?",
      [slug]
    );
    if (conflict) slug = `${slug}-${newId().slice(0, 6)}`;

    const id = newId();
    await execute(
      "INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)",
      [id, body.name.trim(), slug, body.description]
    );

    return NextResponse.json({ id, slug }, { status: 201 });
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
    console.error("POST /api/admin/categories", err);
    return NextResponse.json({ error: "Could not create category." }, { status: 500 });
  }
}