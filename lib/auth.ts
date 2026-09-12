import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { execute, query, queryOne } from "@/lib/db";
import { SCHEMA_SQL, SCHEMA_STATEMENTS } from "@/lib/schema";
import type { AdminUser } from "@/lib/schema";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 256 * 1024 * 1024,
  });
  return `${salt}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const hash = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 256 * 1024 * 1024,
  });
  return timingSafeEqual(Buffer.from(hashHex, "hex"), hash);
}

export function newId(): string {
  return nanoid();
}

let initialized = false;
export async function ensureSchema() {
  if (initialized) return;
  for (const stmt of SCHEMA_STATEMENTS) {
    await execute(stmt);
  }
  initialized = true;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rabs-portal-secret-change-me"
);
export const SESSION_COOKIE = "rabs_admin_session";

export async function createSessionToken(payload: Record<string, unknown>): Promise<string> {
  const { SignJWT } = await import("jose");
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function decodeSessionToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await decodeSessionToken(token);
  const userId = payload?.sub;
  if (typeof userId !== "string") return null;
  const user = await queryOne<AdminUser>(
    "SELECT * FROM admin_users WHERE id = ?",
    [userId]
  );
  return user ?? null;
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function listAdmins(): Promise<AdminUser[]> {
  return query<AdminUser>("SELECT id, username, password_hash, created_at FROM admin_users ORDER BY created_at ASC");
}

export async function getUserByUsername(username: string): Promise<AdminUser | null> {
  return queryOne<AdminUser>(
    "SELECT * FROM admin_users WHERE username = ? COLLATE NOCASE",
    [username]
  );
}