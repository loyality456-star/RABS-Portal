import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusChip } from "@/components/ui/Badges";
import { LeafDivider } from "@/components/Leaf";
import { dashboardStats } from "@/lib/portal";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await dashboardStats();

  const tiles = [
    { label: "Products", value: String(stats.products), href: "/products" },
    { label: "Categories", value: String(stats.categories), href: "/categories" },
    { label: "Reviews", value: String(stats.reviews), href: "/reviews" },
    { label: "Orders", value: String(stats.orders), href: "/orders" },
  ];

  return (
    <div className="space-y-2xl">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Dashboard</h1>
        <p className="mt-xs text-body-md text-on-surface-variant">
          Overview of your apothecary.
        </p>
      </div>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="group">
            <Card hover className="space-y-xs">
              <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant">
                {tile.label}
              </p>
              <p className="font-display text-headline-md text-primary">
                {tile.value}
              </p>
              <p className="text-body-sm text-secondary group-hover:underline">
                Manage →
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-md md:grid-cols-3">
        <Card className="space-y-xs">
          <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant">
            Revenue (excl. cancelled)
          </p>
          <p className="font-display text-headline-md text-primary">
            {formatPrice(stats.revenue)}
          </p>
        </Card>
        <Card className="space-y-xs">
          <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant">
            Pending reviews to reply
          </p>
          <p className="font-display text-headline-md text-primary">
            {stats.pendingReviews}
          </p>
        </Card>
        <Card className="space-y-xs">
          <p className="text-label-md uppercase tracking-[0.08em] text-on-surface-variant">
            Pending orders
          </p>
          <p className="font-display text-headline-md text-primary">
            {stats.pendingOrders}
          </p>
        </Card>
      </div>

      <div>
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-display text-headline-sm text-on-surface">
            Recent orders
          </h2>
          <Link href="/orders" className="text-body-sm text-secondary hover:underline">
            View all →
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <Card>
            <p className="text-body-md text-on-surface-variant">
              No orders yet. They&apos;ll appear here when customers place a COD
              order on the storefront.
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-outline-variant">
              {stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-sm px-lg py-sm hover:bg-surface-container-low"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-title-md text-on-surface">
                        {order.customer_name}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        #{order.id} · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-sm">
                      <span className="font-display text-headline-sm text-primary">
                        {formatPrice(order.total)}
                      </span>
                      <StatusChip status={order.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <LeafDivider />
    </div>
  );
}