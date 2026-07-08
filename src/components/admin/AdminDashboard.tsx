


"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiEye,
  FiMoreVertical,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiStar,
  FiCreditCard,
  FiActivity,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

// ===== Import RTK Query Hook =====
import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";

// ===== Types =====
interface DashboardData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalRiders: number;
    changes: {
      revenue: number;
      orders: number;
      products: number;
      customers: number;
    };
  };
  alerts: {
    pendingOrders: number;
    lowStockProducts: number;
    pendingRiderApplications: number;
    onlineRiders: number;
    successRate: number;
  };
  revenueChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  orderStatus: {
    pending: { count: number; percent: number };
    confirmed: { count: number; percent: number };
    processing: { count: number; percent: number };
    shipped: { count: number; percent: number };
    out_for_delivery: { count: number; percent: number };
    delivered: { count: number; percent: number };
    cancelled: { count: number; percent: number };
    returned: { count: number; percent: number };
  };
  totalOrdersThisMonth: number;
  recentOrders: Array<{
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    _id: string;
    productName: string;
    thumbnail: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  topCategories: Array<{
    _id: string;
    categoryName: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  riderStats: {
    total: number;
    online: number;
    offline: number;
    busy: number;
    totalDeliveries: number;
  };
  recentRiderActivity: Array<{
    riderName: string;
    phone: string;
    status: string;
    totalDeliveries: number;
    locationUpdatedAt?: string;
  }>;
}

// ===== Stat Card Component =====
const StatCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  bgColor,
  loading,
}: any) => (
  <div
    className="bg-[var(--color-background)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)] border border-gray-200 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]"
    style={{ backgroundColor: "var(--color-background)" }}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={26} style={{ color }} />
      </div>
      {change && (
        <span
          className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-[var(--radius-full)] ${
            trend === "up"
              ? "bg-green-50 text-[var(--color-success)]"
              : "bg-red-50 text-[var(--color-error)]"
          }`}
        >
          {trend === "up" ? (
            <FiTrendingUp size={14} />
          ) : (
            <FiTrendingDown size={14} />
          )}
          {change}
        </span>
      )}
    </div>
    {loading ? (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-[var(--radius-sm)] w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-[var(--radius-sm)] w-32"></div>
      </div>
    ) : (
      <>
        <h3
          className="text-3xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {value}
        </h3>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          {title}
        </p>
      </>
    )}
  </div>
);

// ===== Order Status Badge =====
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    processing: "bg-purple-100 text-purple-700 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
    out_for_delivery: "bg-orange-100 text-orange-700 border-orange-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    returned: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned",
  };
  return (
    <span
      className={`px-3 py-1 rounded-[var(--radius-sm)] text-xs font-semibold border capitalize ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

// ===== Payment Method Badge =====
const PaymentBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    cod: "bg-green-50 text-green-700 border-green-200",
    online: "bg-blue-50 text-blue-700 border-blue-200",
    bkash: "bg-pink-50 text-pink-700 border-pink-200",
    nagad: "bg-orange-50 text-orange-700 border-orange-200",
  };
  const labels: Record<string, string> = {
    cod: "Cash on Delivery",
    online: "Online Payment",
    bkash: "bKash",
    nagad: "Nagad",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-[var(--radius-sm)] text-xs font-medium border ${
        colors[method] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[method] || method.toUpperCase()}
    </span>
  );
};

// ===== Rider Status Badge =====
const RiderStatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    online: "bg-green-100 text-green-700 border-green-200",
    offline: "bg-gray-100 text-gray-700 border-gray-200",
    busy: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-[var(--radius-sm)] text-xs font-medium border capitalize ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

// ===== Main Dashboard Component =====
const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState("7days");

  // ===== RTK Query Hook =====
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetDashboardStatsQuery(dateRange, {
    pollingInterval: 30000, // Poll every 30 seconds for real-time updates
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Extract data from response
  const dashboardData = response?.data as DashboardData | undefined;
  const isDataLoading = isLoading || isFetching;

  // ===== Helpers =====
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(amount || 0)
      .replace("BDT", "৳");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: FiClock,
      confirmed: FiCheckCircle,
      processing: FiPackage,
      shipped: FiTruck,
      out_for_delivery: FiTruck,
      delivered: FiCheckCircle,
      cancelled: FiAlertCircle,
      returned: FiRefreshCw,
    };
    return icons[status] || FiClock;
  };

  const getStatusPercent = (status: string): number => {
    if (!dashboardData) return 0;
    const statusMap: Record<string, number> = {
      pending: dashboardData.orderStatus.pending.percent,
      confirmed: dashboardData.orderStatus.confirmed.percent,
      processing: dashboardData.orderStatus.processing.percent,
      shipped: dashboardData.orderStatus.shipped.percent,
      out_for_delivery: dashboardData.orderStatus.out_for_delivery.percent,
      delivered: dashboardData.orderStatus.delivered.percent,
      cancelled: dashboardData.orderStatus.cancelled.percent,
      returned: dashboardData.orderStatus.returned.percent,
    };
    return statusMap[status] || 0;
  };

  const getStatusCount = (status: string): number => {
    if (!dashboardData) return 0;
    const statusMap: Record<string, number> = {
      pending: dashboardData.orderStatus.pending.count,
      confirmed: dashboardData.orderStatus.confirmed.count,
      processing: dashboardData.orderStatus.processing.count,
      shipped: dashboardData.orderStatus.shipped.count,
      out_for_delivery: dashboardData.orderStatus.out_for_delivery.count,
      delivered: dashboardData.orderStatus.delivered.count,
      cancelled: dashboardData.orderStatus.cancelled.count,
      returned: dashboardData.orderStatus.returned.count,
    };
    return statusMap[status] || 0;
  };

  const data = dashboardData;

  // ===== Order Status Items for Chart =====
  const statusItems = [
    { key: "delivered", label: "Delivered", color: "#22C55E" },
    { key: "out_for_delivery", label: "Out for Delivery", color: "#F97316" },
    { key: "shipped", label: "Shipped", color: "#6366F1" },
    { key: "processing", label: "Processing", color: "#8B5CF6" },
    { key: "confirmed", label: "Confirmed", color: "#3B82F6" },
    { key: "pending", label: "Pending", color: "#F59E0B" },
    { key: "cancelled", label: "Cancelled", color: "#EF4444" },
    { key: "returned", label: "Returned", color: "#6B7280" },
  ];

  return (
    <div className="space-y-8">
      {/* ===== Page Header ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Dashboard
          </h1>
          <p style={{ color: "var(--color-text-muted)" }} className="mt-1">
            Welcome! Here's a summary of your business today.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-[var(--radius-md)] bg-[var(--color-background)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
            style={{ color: "var(--color-text-primary)" }}
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="year">This year</option>
          </select>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2.5 bg-[var(--color-background)] border border-gray-200 rounded-[var(--radius-md)] text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all duration-[var(--transition-base)]"
            style={{ color: "var(--color-text-primary)" }}
          >
            <FiRefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            className="px-5 py-2.5 text-white rounded-[var(--radius-md)] text-sm font-semibold hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Download Report
          </button>
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data?.summary.totalRevenue || 0)}
          change={`+${data?.summary.changes.revenue || 0}%`}
          trend="up"
          icon={FiDollarSign}
          color="var(--color-primary)"
          bgColor="rgba(97, 157, 35, 0.15)"
          loading={isDataLoading}
        />
        <StatCard
          title="Total Orders"
          value={(data?.summary.totalOrders || 0).toLocaleString()}
          change={`+${data?.summary.changes.orders || 0}%`}
          trend="up"
          icon={FiShoppingCart}
          color="#3B82F6"
          bgColor="rgba(59, 130, 246, 0.15)"
          loading={isDataLoading}
        />
        <StatCard
          title="Total Products"
          value={(data?.summary.totalProducts || 0).toLocaleString()}
          change={`+${data?.summary.changes.products || 0}%`}
          trend="up"
          icon={FiShoppingBag}
          color="#F59E0B"
          bgColor="rgba(245, 158, 11, 0.15)"
          loading={isDataLoading}
        />
        <StatCard
          title="Total Customers"
          value={(data?.summary.totalCustomers || 0).toLocaleString()}
          change={`+${data?.summary.changes.customers || 0}%`}
          trend="up"
          icon={FiUsers}
          color="#EC4899"
          bgColor="rgba(236, 72, 153, 0.15)"
          loading={isDataLoading}
        />
      </div>

      {/* ===== Alert Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-[var(--color-background)] border border-gray-200 rounded-[var(--radius-md)] p-4 flex items-center gap-4 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]"
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
            style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}
          >
            <FiClock size={24} style={{ color: "#F59E0B" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#F59E0B" }}>
              {data?.alerts.pendingOrders || 0}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Pending Orders
            </p>
          </div>
          <Link
            href="/dashboard/admin/orders?status=pending"
            className="ml-auto"
            style={{ color: "#F59E0B" }}
          >
            <FiArrowRight size={20} />
          </Link>
        </div>

        <div
          className="bg-[var(--color-background)] border border-gray-200 rounded-[var(--radius-md)] p-4 flex items-center gap-4 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]"
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
          >
            <FiAlertCircle size={24} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#EF4444" }}>
              {data?.alerts.lowStockProducts || 0}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Low Stock Products
            </p>
          </div>
          <Link
            href="/dashboard/admin/products?stock=low"
            className="ml-auto"
            style={{ color: "#EF4444" }}
          >
            <FiArrowRight size={20} />
          </Link>
        </div>

        <div
          className="bg-[var(--color-background)] border border-gray-200 rounded-[var(--radius-md)] p-4 flex items-center gap-4 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]"
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
            style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
          >
            <FiCheckCircle size={24} style={{ color: "#22C55E" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#22C55E" }}>
              {data?.alerts.successRate || 0}%
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Success Rate
            </p>
          </div>
          <Link
            href="/dashboard/admin/analytics"
            className="ml-auto"
            style={{ color: "#22C55E" }}
          >
            <FiArrowRight size={20} />
          </Link>
        </div>

        <div
          className="bg-[var(--color-background)] border border-gray-200 rounded-[var(--radius-md)] p-4 flex items-center gap-4 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]"
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
            style={{ backgroundColor: "rgba(97, 157, 35, 0.15)" }}
          >
            <FiTruck size={24} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
              {data?.alerts.onlineRiders || 0}/{data?.summary.totalRiders || 0}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Online Riders
            </p>
          </div>
          <Link
            href="/dashboard/admin/riders"
            className="ml-auto"
            style={{ color: "var(--color-primary)" }}
          >
            <FiArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* ===== Charts Row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Revenue Chart ===== */}
        <div
          className="lg:col-span-2 bg-[var(--color-background)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)] border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Revenue Overview
              </h2>
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
                Daily revenue statistics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-[var(--radius-full)]"
                  style={{ backgroundColor: "var(--color-primary)" }}
                ></span>
                <span style={{ color: "var(--color-text-muted)" }} className="text-sm">
                  Revenue
                </span>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-[var(--radius-lg)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                <FiMoreVertical />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72 flex items-end justify-between gap-3 px-2">
            {data?.revenueChart && data.revenueChart.length > 0 ? (
              data.revenueChart.map((item, i) => {
                const maxRev = Math.max(
                  ...data.revenueChart.map((d) => d.revenue),
                  1
                );
                const heightPercentage = (item.revenue / maxRev) * 100;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full h-full flex items-end">
                      <div
                        className="w-full rounded-t-[var(--radius-sm)] transition-all duration-[var(--transition-base)] group-hover:opacity-80 cursor-pointer"
                        style={{
                          height: `${Math.max(heightPercentage, 2)}%`,
                          background: `linear-gradient(to top, var(--color-primary), #8BC34A)`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-medium truncate w-full text-center"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formatDate(item.date)}
                    </span>
                    <span
                      className="text-[8px] font-semibold"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.orders} orders
                    </span>
                  </div>
                );
              })
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                {isDataLoading ? "Loading chart..." : "No data available"}
              </div>
            )}
          </div>

          {/* Chart Stats */}
          {data?.revenueChart && data.revenueChart.length > 0 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Total Revenue
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {formatCurrency(
                    data.revenueChart.reduce((sum, d) => sum + d.revenue, 0)
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Total Orders
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {data.revenueChart.reduce((sum, d) => sum + d.orders, 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===== Order Status Chart ===== */}
        <div
          className="bg-[var(--color-background)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)] border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Order Status
              </h2>
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
                Current breakdown
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {statusItems.map((item) => {
              const count = getStatusCount(item.key);
              const percent = getStatusPercent(item.key);

              return (
                <div key={item.key}>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span
                      className="flex items-center gap-2 font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {React.createElement(getStatusIcon(item.key), {
                        size: 16,
                        style: { color: item.color },
                      })}
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--color-text-muted)" }} className="text-xs">
                        {count} orders
                      </span>
                      <span className="font-bold" style={{ color: item.color }}>
                        {percent}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="h-2.5 rounded-[var(--radius-full)] overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    <div
                      className="h-full rounded-[var(--radius-full)] transition-all duration-[var(--transition-slow)]"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p
                className="text-4xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {(data?.summary.totalOrders || 0).toLocaleString()}
              </p>
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm mt-1">
                Total Orders This Month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tables Row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== Recent Orders ===== */}
        <div
          className="bg-[var(--color-background)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-gray-200 overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Recent Orders
              </h2>
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
                Latest customer orders
              </p>
            </div>
            <Link
              href="/dashboard/admin/orders"
              className="text-sm font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-muted)" }}
              >
                <tr>
                  <th className="text-left px-6 py-4">Order</th>
                  <th className="text-left px-6 py-4">Customer</th>
                  <th className="text-left px-6 py-4">Amount</th>
                  <th className="text-left px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 transition-colors duration-[var(--transition-fast)]"
                    >
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {order.orderNumber}
                        </p>
                        <PaymentBadge method={order.paymentMethod} />
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {order.customerName || "Guest"}
                        </p>
                        {order.customerPhone && (
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {order.customerPhone}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {formatCurrency(order.amount)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {isDataLoading ? "Loading orders..." : "No recent orders found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Top Products ===== */}
        <div
          className="bg-[var(--color-background)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-gray-200 overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Top Products
              </h2>
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
                Best selling products
              </p>
            </div>
            <Link
              href="/dashboard/admin/products"
              className="text-sm font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {data?.topProducts && data.topProducts.length > 0 ? (
              data.topProducts.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-[var(--transition-fast)]"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: "var(--color-surface)" }}
                    >
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiShoppingBag size={24} style={{ color: "var(--color-text-muted)" }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-semibold truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {product.productName}
                      </p>
                      <p
                        className="text-sm flex items-center gap-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <FiActivity size={12} />
                        {product.totalSold} sold •{" "}
                        {formatCurrency(product.totalRevenue)} revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-[var(--radius-full)]"
                      style={{
                        backgroundColor: "rgba(97, 157, 35, 0.1)",
                        color: "var(--color-primary)",
                      }}
                    >
                      #{i + 1}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="p-10 text-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                {isDataLoading ? "Loading products..." : "No top products found"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="bg-[var(--color-background)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)] border border-gray-200">
        <h2
          className="text-xl font-bold mb-6"
          style={{ color: "var(--color-text-primary)" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Add Product",
              icon: FiShoppingBag,
              href: "/dashboard/admin/products/new",
              color: "var(--color-primary)",
            },
            {
              label: "View Orders",
              icon: FiShoppingCart,
              href: "/dashboard/admin/orders",
              color: "#3B82F6",
            },
            {
              label: "Customers",
              icon: FiUsers,
              href: "/dashboard/admin/customers",
              color: "#EC4899",
            },
            {
              label: "Analytics",
              icon: FiActivity,
              href: "/dashboard/admin/analytics",
              color: "#F59E0B",
            },
            {
              label: "Payments",
              icon: FiCreditCard,
              href: "/dashboard/admin/payments",
              color: "#6366F1",
            },
            {
              label: "Riders",
              icon: FiTruck,
              href: "/dashboard/admin/riders",
              color: "#8B5CF6",
            },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-3 p-5 rounded-[var(--radius-md)] border border-gray-200 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)] group bg-[var(--color-surface)]"
            >
              <div
                className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon size={24} style={{ color: action.color }} />
              </div>
              <span
                className="text-sm font-semibold group-hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)]"
                style={{ color: "var(--color-text-primary)" }}
              >
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Rider Stats ===== */}
      {data?.riderStats && (
        <div className="bg-[var(--color-background)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)] border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Rider Activity
              </h2>
              <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
                Real-time rider status and deliveries
              </p>
            </div>
            <Link
              href="/dashboard/admin/riders"
              className="text-sm font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Rider Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-[var(--radius-md)]" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {data.riderStats.total}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Total Riders</p>
            </div>
            <div className="text-center p-4 rounded-[var(--radius-md)]" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-2xl font-bold" style={{ color: "#22C55E" }}>
                {data.riderStats.online}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Online</p>
            </div>
            <div className="text-center p-4 rounded-[var(--radius-md)]" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-2xl font-bold" style={{ color: "#6B7280" }}>
                {data.riderStats.offline}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Offline</p>
            </div>
            <div className="text-center p-4 rounded-[var(--radius-md)]" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                {data.riderStats.totalDeliveries}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Deliveries</p>
            </div>
          </div>

          {/* Recent Rider Activity */}
          <div className="space-y-3">
            {data.recentRiderActivity && data.recentRiderActivity.length > 0 ? (
              data.recentRiderActivity.map((rider, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-[var(--radius-md)] border border-gray-100 hover:border-[var(--color-primary)] transition-all duration-[var(--transition-fast)]"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[var(--radius-full)] flex items-center justify-center" style={{ backgroundColor: "rgba(97, 157, 35, 0.15)" }}>
                      <FiUser size={20} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {rider.riderName}
                      </p>
                      <div className="flex items-center gap-2">
                        <FiPhone size={12} style={{ color: "var(--color-text-muted)" }} />
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {rider.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {rider.totalDeliveries} deliveries
                    </span>
                    <RiderStatusBadge status={rider.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                No rider activity found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;