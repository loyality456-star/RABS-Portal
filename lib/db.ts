import { createClient } from "@libsql/client";

let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[]
): Promise<T[]> {
  const db = getDb();
  const result = await db.execute({ sql, args: (args ?? []) as never[] });
  return result.rows as T[];
}

export async function execute(sql: string, args?: unknown[]) {
  const db = getDb();
  return db.execute({ sql, args: (args ?? []) as never[] });
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows[0] ?? null;
}