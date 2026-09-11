import { query, queryOne } from "@/lib/db";
import type { Order, ProductWithCategory, ReviewWithProduct } from "@/lib/schema";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listProductsWithStats(): Promise<ProductWithCategory[]> {
  const rows = await query<ProductWithCategory>(
    `SELECT
       p.*,
       c.name AS category_name,
       COUNT(CASE WHEN r.id IS NOT NULL THEN 1 END) AS review_count,
       AVG(r.rating) AS average_rating
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN reviews r ON r.product_id = p.id
     GROUP BY p.id
     ORDER BY p.created_at DESC`
  );
  return rows.map((row) => ({
    ...row,
    is_featured: Boolean(row.is_featured),
    is_active: Boolean(row.is_active),
    review_count: Number(row.review_count ?? 0),
    average_rating:
      row.average_rating == null ? null : Number(Number(row.average_rating).toFixed(1)),
  }));
}

export async function listReviewsWithProduct(): Promise<ReviewWithProduct[]> {
  return query<ReviewWithProduct>(
    `SELECT r.*, p.name AS product_name
     FROM reviews r
     LEFT JOIN products p ON p.id = r.product_id
     ORDER BY r.created_at DESC`
  );
}

export async function getOrder(id: string): Promise<Order | null> {
  return queryOne<Order>("SELECT * FROM orders WHERE id = ?", [id]);
}

export async function getOrderItems(orderId: string) {
  return query<import("@/lib/schema").OrderItem>(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY rowid ASC",
    [orderId]
  );
}

export async function dashboardStats() {
  const [products, categories, reviews, orders, revenue] = await Promise.all([
    query<{ n: number }>("SELECT COUNT(*) AS n FROM products"),
    query<{ n: number }>("SELECT COUNT(*) AS n FROM categories"),
    query<{ n: number }>("SELECT COUNT(*) AS n FROM reviews"),
    query<{ n: number }>("SELECT COUNT(*) AS n FROM orders"),
    query<{ n: number }>(
      "SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status NOT IN ('cancelled')"
    ),
  ]);
  const pendingReviews = await query<{ n: number }>(
    "SELECT COUNT(*) AS n FROM reviews WHERE reply IS NULL"
  );
  const pendingOrders = await query<{ n: number }>(
    "SELECT COUNT(*) AS n FROM orders WHERE status = 'pending'"
  );
  const recentOrders = await query<Order>(
    "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5"
  );

  return {
    products: Number(products[0]?.n ?? 0),
    categories: Number(categories[0]?.n ?? 0),
    reviews: Number(reviews[0]?.n ?? 0),
    orders: Number(orders[0]?.n ?? 0),
    revenue: Number(revenue[0]?.n ?? 0),
    pendingReviews: Number(pendingReviews[0]?.n ?? 0),
    pendingOrders: Number(pendingOrders[0]?.n ?? 0),
    recentOrders,
  };
}

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-tertiary-container text-white",
  confirmed: "bg-secondary-container text-on-secondary-container",
  shipped: "bg-primary-container text-on-primary-container",
  delivered: "bg-primary text-white",
  cancelled: "bg-error-container text-error-on-container",
};