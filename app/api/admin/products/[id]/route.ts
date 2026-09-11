import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/portal";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    slug: z.string().max(140).optional().nullable(),
    description: z.string().max(10000).optional(),
    price: z.number().min(0).optional(),
    image_url: z.string().url().optional().nullable().or(z.literal("")),
    category_id: z.string().optional().nullable().or(z.literal("")),
    is_featured: z.boolean().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "Provide at least one field to update.",
  });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    await requireAdmin();
    const { id } = await params;
    const body = patchSchema.parse(await req.json());

    const product = await queryOne<{ id: string }>(
      "SELECT id FROM products WHERE id = ?",
      [id]
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    let slug =
      body.slug && typeof body.slug === "string" && body.slug !== ""
        ? slugify(body.slug)
        : undefined;

    if (slug) {
      const conflict = await queryOne<{ id: string }>(
        "SELECT id FROM products WHERE slug = ? AND id != ?",
        [slug, id]
      );
      if (conflict) slug = `${slug}-${id.slice(0, 6)}`;
    }

    const fields: string[] = [];
    const args: unknown[] = [];

    const set = (column: string, exists: boolean, value: unknown) => {
      if (exists) {
        fields.push(`${column} = ?`);
        args.push(value);
      }
    };

    set("name", body.name !== undefined, body.name);
    if (slug) {
      fields.push("slug = ?");
      args.push(slug);
    }
    set("description", body.description !== undefined, body.description);
    set("price", body.price !== undefined, body.price);
    set(
      "image_url",
      body.image_url !== undefined,
      body.image_url ? String(body.image_url) : null
    );
    set(
      "category_id",
      body.category_id !== undefined,
      body.category_id ? String(body.category_id) : null
    );
    set(
      "is_featured",
      body.is_featured !== undefined,
      body.is_featured ? 1 : 0
    );
    set("is_active", body.is_active !== undefined, body.is_active ? 1 : 0);

    if (fields.length > 0) {
      await execute(
        `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
        [...args, id]
      );
    }

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
    console.error("PATCH /api/admin/products/[id]", err);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
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
    const result = await execute("DELETE FROM products WHERE id = ?", [id]);
    if (Number(result.rowsAffected) === 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("DELETE /api/admin/products/[id]", err);
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}