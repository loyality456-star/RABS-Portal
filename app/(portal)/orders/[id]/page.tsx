import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { OrderStatusManager } from "@/components/OrderStatusManager";
import { getOrder, getOrderItems } from "@/lib/portal";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, items] = await Promise.all([getOrder(id), getOrderItems(id)]);
  if (!order) notFound();

  const placedAt = new Date(order.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-lg">
      <div>
        <Link href="/orders" className="eyebrow hover:underline">← Orders</Link>
        <h1 className="mt-xs font-display text-headline-lg text-on-surface">
          Order #{id}
        </h1>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Placed {placedAt}
        </p>
      </div>

      <div className="grid gap-lg lg:grid-cols-[1fr_360px]">
        <div className="space-y-md">
          <Card className="overflow-hidden p-0">
            <h2 className="border-b border-outline-variant px-lg py-md font-display text-headline-sm text-on-surface">
              Items ({items.length})
            </h2>
            <ul className="divide-y divide-outline-variant">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-sm px-lg py-sm"
                >
                  <span className="text-body-md text-on-surface">
                    {item.product_name}
                    <span className="text-on-surface-variant">
                      {" "}× {item.quantity}
                    </span>
                  </span>
                  <span className="text-body-md text-on-surface">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between bg-surface-container-low px-lg py-sm">
                <span className="text-title-lg text-on-surface">Total (COD)</span>
                <span className="font-display text-headline-md text-primary">
                  {formatPrice(order.total)}
                </span>
              </li>
            </ul>
          </Card>

          <Card className="space-y-md">
            <h2 className="font-display text-headline-sm text-on-surface">
              Delivery details
            </h2>
            <div className="grid gap-md sm:grid-cols-2">
              <div>
                <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  Customer
                </p>
                <p className="mt-xs text-body-lg text-on-surface">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  Phone
                </p>
                <p className="mt-xs text-body-lg text-on-surface">{order.phone}</p>
              </div>
              {order.email && (
                <div>
                  <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                    Email
                  </p>
                  <p className="mt-xs text-body-lg text-on-surface">{order.email}</p>
                </div>
              )}
              <div>
                <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  City
                </p>
                <p className="mt-xs text-body-lg text-on-surface">{order.city}</p>
              </div>
            </div>
            <div>
              <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                Delivery address
              </p>
              <p className="mt-xs whitespace-pre-line text-body-lg text-on-surface">
                {order.address}
              </p>
            </div>
            {order.notes && (
              <div>
                <p className="text-label-md uppercase tracking-[0.06em] text-on-surface-variant">
                  Notes
                </p>
                <p className="mt-xs whitespace-pre-line text-body-md text-on-surface-variant">
                  {order.notes}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-md">
          <Card className="space-y-md h-fit">
            <h2 className="font-display text-headline-sm text-on-surface">
              Order status
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Move the order through the fulfilment flow. Customers have no
              portal access — statuses are for your tracking.
            </p>
            <OrderStatusManager id={order.id} current={order.status} />
          </Card>
        </div>
      </div>
    </div>
  );
}