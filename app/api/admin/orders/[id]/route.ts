import { NextResponse } from "next/server";
import { z } from "zod";
import { execute, queryOne } from "@/lib/db";
import { ensureSchema, requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/portal";
import type { Order } from "@/lib/schema";

export const dynamic = "force-dynamic";

const schema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureSchema();
    await requireAdmin();
    const { id } = await params;
    const { status } = schema.parse(await req.json());

    const order = await queryOne<Order>("SELECT * FROM orders WHERE id = ?", [id]);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    await execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
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
    console.error("PATCH /api/admin/orders/[id]", err);
    return NextResponse.json({ error: "Could not update order." }, { status: 500 });
  }
}