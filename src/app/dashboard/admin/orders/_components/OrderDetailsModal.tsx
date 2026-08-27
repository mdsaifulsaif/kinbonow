"use client";

import React from "react";
import { FiX, FiMapPin, FiPhone, FiPackage, FiTruck, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { useGetAdminOrderByIdQuery } from "@/redux/api/orderApi";

const BRAND = "#5CAF90";

interface Props {
  orderId: string;
  onClose: () => void;
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

export default function OrderDetailsModal({ orderId, onClose }: Props) {
  const { data, isLoading, error } = useGetAdminOrderByIdQuery(orderId);
  const order = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-800">
            Order Details {order?.orderNumber && `— ${order.orderNumber}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#5CAF90] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-10">Failed to load order details</p>
          ) : !order ? (
            <p className="text-center text-gray-400 py-10">Order not found</p>
          ) : (
            <>
              {/* Customer Info */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiUser size={13} /> Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-[11px] text-gray-400">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order?.deliveryAddress?.name || order?.userID?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order?.deliveryAddress?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiMapPin size={13} /> Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                  <p>
                    {order?.deliveryType === "local" ? "Local Delivery" : "Nationwide Delivery"}
                  </p>
                  <p>
                    {[
                      order?.deliveryAddress?.houseNo,
                      order?.deliveryAddress?.road,
                      order?.deliveryAddress?.flatNo,
                      order?.deliveryAddress?.upazila,
                      order?.deliveryAddress?.district,
                      order?.deliveryAddress?.area?.name || order?.deliveryAddress?.area,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address provided"}
                  </p>
                  {order?.deliveryAddress?.deliveryNotes && (
                    <p className="text-xs text-gray-500 mt-1">
                      Note: {order.deliveryAddress.deliveryNotes}
                    </p>
                  )}
                </div>
              </section>

              {/* Delivery Slot */}
              {(order?.deliveryDate || order?.deliveryTime) && (
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiTruck size={13} /> Delivery Slot
                  </h3>
                  <div className="flex gap-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                    {order?.deliveryDate && (
                      <p className="flex items-center gap-1.5">
                        <FiCalendar size={13} /> {formatDateTime(order.deliveryDate)}
                      </p>
                    )}
                    {order?.deliveryTime && (
                      <p className="flex items-center gap-1.5">
                        <FiClock size={13} /> {order.deliveryTime}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Items */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiPackage size={13} /> Items
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  {order?.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-4 py-3 text-sm ${
                        i !== order.items.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} × ৳{item.unitPrice}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">৳{item.totalPrice}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Summary */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Payment Summary
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">৳{order?.subtotal ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">৳{order?.shippingCharge ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-green-600">
                      -৳{order?.discountAmount ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800">৳{order?.totalAmount ?? 0}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-xs text-gray-500">
                    <span>Payment Method</span>
                    <span className="uppercase font-semibold">{order?.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment Status</span>
                    <span className="capitalize font-semibold">{order?.paymentStatus}</span>
                  </div>
                </div>
              </section>

              {order?.specialInstructions && (
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Special Instructions
                  </h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                    {order.specialInstructions}
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}