import { NextResponse } from "next/server";
import { z } from "zod";
import { execute } from "@/lib/db";
import {
  ensureSchema,
  getUserByUsername,
  hashPassword,
  newId,
  requireAdmin,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().min(2).max(40),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    await requireAdmin();
    const { username, password } = schema.parse(await req.json());

    const existing = await getUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );
    }

    const id = newId();
    const hash = hashPassword(password);
    await execute(
      "INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)",
      [id, username, hash]
    );
    return NextResponse.json({ ok: true, username }, { status: 201 });
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
    console.error("POST /api/admin/admins", err);
    return NextResponse.json({ error: "Could not create admin." }, { status: 500 });
  }
}