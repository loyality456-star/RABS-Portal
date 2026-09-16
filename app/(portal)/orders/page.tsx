import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/Badges";
import { OrderDeleteButton } from "@/components/OrderDeleteButton";
import { query } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await query<Order>(
    `SELECT * FROM orders
     ${status && status !== "all" ? "WHERE status = ?" : ""}
     ORDER BY created_at DESC`,
    status && status !== "all" ? [status] : []
  );

  const statuses = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Orders</h1>
        <p className="mt-xs text-body-md text-on-surface-variant">
          Cash on Delivery orders placed on the storefront. Update status as
          you confirm, ship and deliver.
        </p>
      </div>

      <div className="flex flex-wrap gap-xs">
        {statuses.map((s) => {
          const href = s === "all" ? "/orders" : `/orders?status=${s}`;
          const active = (status ?? "all") === s;
          return (
            <Link
              key={s}
              href={href}
              className={`chip capitalize ${active ? "chip-active" : ""}`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <Card className="py-3xl text-center">
          <p className="font-display text-headline-sm text-on-surface">
            No orders here
          </p>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Orders placed with Cash on Delivery on the storefront will appear
            here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-outline-variant text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  <th className="px-lg py-sm">Order</th>
                  <th className="px-lg py-sm">Customer</th>
                  <th className="px-lg py-sm">City</th>
                  <th className="px-lg py-sm">Total</th>
                  <th className="px-lg py-sm">Status</th>
                  <th className="px-lg py-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-lg py-sm">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-body-sm text-secondary hover:underline"
                      >
                        #{order.id}
                      </Link>
                      <p className="text-body-sm text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-lg py-sm text-title-md text-on-surface">
                      {order.customer_name}
                    </td>
                    <td className="px-lg py-sm text-body-md text-on-surface-variant">
                      {order.city}
                    </td>
                    <td className="px-lg py-sm font-display text-title-lg text-primary">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-lg py-sm">
                      <StatusChip status={order.status} />
                    </td>
                    <td className="px-lg py-sm text-right">
                      <OrderDeleteButton orderId={order.id} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}