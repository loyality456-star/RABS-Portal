import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, getUserByUsername, hashPassword, newId, SESSION_COOKIE, createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().min(2).max(40),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
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
    const token = await createSessionToken({ sub: id, username });
    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ ok: true, username });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    console.error("POST /api/auth/setup", err);
    return NextResponse.json({ error: "Setup failed." }, { status: 500 });
  }
}