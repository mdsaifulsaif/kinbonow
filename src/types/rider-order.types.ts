// types/rider-order.types.ts

export interface OrderItem {
  productID: string;
  variantID: string | null;
  productType: string;
  productName: string;
  thumbnail: string;
  sku: string;
  quantity: number;
  unit: string;
  weightOrVolume: number;
  unitPrice: number;
  salePrice: number;
  totalPrice: number;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  city: string;
  area: string; // ObjectId reference - not populated by backend yet
  label?: string;
}

export interface RiderOrder {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  // Backend enum: pending | confirmed | processing | shipped | out_for_delivery | delivered | cancelled | returned
  status: string;
  createdAt: string;
  pendingExpiresAt: string;
  cancelReason?: string;
  cancelledBy?: string;
}

export const TERMINAL_STATUSES = ["delivered", "cancelled", "returned"];

export function getAreaLabel(addr: DeliveryAddress): string {
  // "area" is currently an ObjectId reference from backend (not populated).
  // Showing city + label until backend populates the area name.
  const parts = [addr.city, addr.label].filter(Boolean);
  return parts.join(", ");
}

export function getTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return minutes + "m " + seconds + "s left";
}