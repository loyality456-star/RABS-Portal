import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, newId, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/portal";

export const dynamic = "force-dynamic";

const productSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().max(140).optional().or(z.literal("")),
  description: z.string().max(10000).default(""),
  price: z.number().min(0),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  category_id: z.string().optional().nullable().or(z.literal("")),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    await requireAdmin();
    const body = productSchema.parse(await req.json());

    let slug = slugify(body.slug || body.name);
    if (!slug) slug = newId();
    const conflict = await queryOne<{ id: string }>(
      "SELECT id FROM products WHERE slug = ?",
      [slug]
    );
    if (conflict) slug = `${slug}-${newId().slice(0, 6)}`;

    const id = newId();
    await execute(
      `INSERT INTO products (id, name, slug, description, price, image_url, category_id, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.name,
        slug,
        body.description,
        body.price,
        body.image_url || null,
        body.category_id || null,
        body.is_featured ? 1 : 0,
        body.is_active ? 1 : 0,
      ]
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
    console.error("POST /api/admin/products", err);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}