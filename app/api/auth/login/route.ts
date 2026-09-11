import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  ensureSchema,
  getUserByUsername,
  hashPassword,
  verifyPassword,
  SESSION_COOKIE,
} from "@/lib/auth";
import { query } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const { username, password } = schema.parse(await req.json());
    const user = await getUserByUsername(username);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }
    const token = await createSessionToken({ sub: user.id, username: user.username });
    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ ok: true, username: user.username });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    console.error("POST /api/auth/login", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}