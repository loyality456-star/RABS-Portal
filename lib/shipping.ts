export const SHIPPING_RATE = 200;
export const ITEMS_PER_BLOCK = 5;

export function shippingForQuantity(quantity: number): number {
  if (quantity <= 0) return 0;
  return Math.ceil(quantity / ITEMS_PER_BLOCK) * SHIPPING_RATE;
}

export function orderTotal(subtotal: number, quantity: number): number {
  return subtotal + shippingForQuantity(quantity);
}