// // lib/socket.ts
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import toast from "react-hot-toast";
// import { useSession } from "next-auth/react";

// interface Notification {
//   id: string;
//   orderID: string;
//   orderNumber: string;
//   totalAmount: number;
//   deliveryFee: number;
//   riderCommission: number;
//   deliveryAddress: {
//     area: string;
//     city: string;
//     houseNo?: string;
//     road?: string;
//   };
//   itemCount: number;
//   paymentMethod: string;
//   createdAt: string;
//   read: boolean;
//   timestamp: string;
//   area?: string;
//   type?: "rider-order" | "admin-order";
//   customerName?: string;
//   customerPhone?: string;
//   riderCount?: number;
//   availableRiders?: Array<{
//     id: string;
//     userID?: string;
//     name: string;
//     phone?: string;
//     status?: string;
//     areas?: string[];
//   }>;
// }

// export const useSocket = () => {
//   const { data: session, status } = useSession();

//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [riderAreas, setRiderAreas] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const socketRef = useRef<Socket | null>(null);
//   const isInitialized = useRef(false);
//   // ✅ riderAreas স্টেট সাথে সাথে আপডেট হয় না বলে socket callback এ পুরনো
//   // ভ্যালু ধরে ফেলে (stale closure) — তাই একটা ref এ latest ভ্যালু রাখছি
//   const riderAreasRef = useRef<string[]>([]);

//   useEffect(() => {
//     riderAreasRef.current = riderAreas;
//   }, [riderAreas]);

//   // ✅ Add notification with area filter
//   const addNotification = (data: any) => {
//     const notificationArea = data.area || data.deliveryAddress?.area || "Unknown";
//     const riderCurrentAreas = riderAreasRef.current;

//     console.log(`📍 Notification Area: ${notificationArea}`);
//     console.log(`📍 Rider Areas: ${riderCurrentAreas.join(", ") || "Not set"}`);

//     // ✅ rider এর assigned area থাকলে match চেক করো, admin (area খালি) হলে সব দেখাও
//     if (riderCurrentAreas.length > 0) {
//       const hasArea = riderCurrentAreas.some(
//         (area) => area.toLowerCase() === notificationArea.toLowerCase(),
//       );

//       if (!hasArea) {
//         console.log(`⛔ Notification ignored - Area mismatch: ${notificationArea}`);
//         return;
//       }
//     }

//     const newNotification: Notification = {
//       id: data.orderID || data.orderId || Date.now().toString(),
//       orderID: data.orderID || data.orderId,
//       orderNumber: data.orderNumber || `ORD-${Date.now()}`,
//       totalAmount: data.totalAmount || data.amount || 0,
//       deliveryFee: data.deliveryFee || data.deliveryCharge || 0,
//       riderCommission: data.riderCommission || data.commission || 0,
//       deliveryAddress: data.deliveryAddress || { area: "Unknown", city: "Unknown" },
//       itemCount: data.itemCount || data.items || 0,
//       paymentMethod: data.paymentMethod || "cod",
//       createdAt: data.createdAt || new Date().toISOString(),
//       read: false,
//       timestamp: new Date().toISOString(),
//       area: notificationArea,
//       type: data.type || "rider-order",
//       customerName: data.customerName || "Customer",
//       customerPhone: data.customerPhone || "N/A",
//       availableRiders: data.availableRiders || [],
//       riderCount: data.riderCount || 0,
//     };

//     setNotifications((prev) => {
//       const exists = prev.some((n) => n.id === newNotification.id);
//       if (exists) return prev;
//       return [newNotification, ...prev];
//     });
//     setUnreadCount((prev) => prev + 1);

//     const areaText = riderCurrentAreas.length > 0 ? ` in ${notificationArea}` : "";
//     toast.success(
//       `🆕 New Order${areaText}! #${newNotification.orderNumber} - ${newNotification.totalAmount} TK`,
//       { duration: 5000, position: "top-right" },
//     );

//     if (
//       typeof window !== "undefined" &&
//       "Notification" in window &&
//       Notification.permission === "granted"
//     ) {
//       new Notification(`🆕 New Order${areaText}!`, {
//         body: `Order #${newNotification.orderNumber} - ${newNotification.totalAmount} TK\n📍 Area: ${notificationArea}`,
//         icon: "/rider-icon.png",
//       });
//     }

//     try {
//       const audio = new Audio("/notification.mp3");
//       audio.play().catch(() => {});
//     } catch (e) {
//       // ignore
//     }
//   };

//   useEffect(() => {
//     if (isInitialized.current) return;
//     if (status === "loading") return;

//     // ✅ Login করা না থাকলে socket connect করার দরকার নেই
//     if (status !== "authenticated" || !session?.user?.id) {
//       setIsLoading(false);
//       return;
//     }

//     const userID = session.user.id; // ✅ backend এর User._id — এটাই room match করার key
//     const role = (session.user as any)?.role;

//     const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
//     console.log("🔌 Connecting to socket server:", socketUrl);

//     const socket = io(socketUrl, {
//       transports: ["websocket", "polling"],
//       withCredentials: true,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("✅ Socket connected with ID:", socket.id);
//       setIsConnected(true);

//       if (role === "admin") {
//         socket.emit("admin-join", { adminID: userID });
//         console.log(`👨‍💼 Emitted admin-join with ID: ${userID}`);
//       } else {
//         socket.emit("rider-join", { userID });
//         console.log(`🏍️ Emitted rider-join with ID: ${userID}`);
//       }
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected. Reason:", reason);
//       setIsConnected(false);
//       if (reason === "io server disconnect" || reason === "transport close") {
//         socket.connect();
//       }
//     });

//     socket.on("connect_error", (error) => {
//       console.error("🔴 Socket connect_error:", error);
//     });

//     // ✅ backend rider-join handler নিজেই DB থেকে area খুঁজে এখানে পাঠায়
//     socket.on("rider-join-ack", (data: any) => {
//       console.log("✅ Rider join acknowledgment:", data);
//       if (Array.isArray(data.areas)) {
//         setRiderAreas(data.areas);
//       }
//     });

//     socket.on("admin-join-ack", (data: any) => {
//       console.log("✅ Admin join acknowledgment:", data);
//     });

//     socket.on("new-order-notification", (data: any) => {
//       console.log("📢 New order notification received:", data);
//       addNotification(data);
//     });

//     socket.on("admin-new-order-notification", (data: any) => {
//       console.log("👨‍💼 Admin new order notification:", data);
//       addNotification({ ...data, type: "admin-order" });
//     });

//     socket.on("admin-no-rider-available", (data: any) => {
//       console.log("⚠️ No rider available:", data);
//       toast.error(
//         `⚠️ No rider available for order #${data.orderNumber} in ${data.area}`,
//         { duration: 5000, position: "top-right" },
//       );
//     });

//     socket.on("rider-status-change", (data: any) => {
//       console.log("📡 Rider status change:", data);
//     });

//     setIsLoading(false);
//     isInitialized.current = true;

//     return () => {
//       socket.disconnect();
//       socketRef.current = null;
//       isInitialized.current = false;
//     };
//   }, [status, session]);

//   const markAsRead = (notificationId: string) => {
//     setNotifications((prev) =>
//       prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)),
//     );
//     setUnreadCount((prev) => Math.max(0, prev - 1));
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
//     setUnreadCount(0);
//   };

//   return {
//     isConnected,
//     notifications,
//     unreadCount,
//     riderAreas,
//     riderId: session?.user?.id ?? null,
//     isLoading,
//     markAsRead,
//     markAllAsRead,
//     setNotifications,
//     setUnreadCount,
//   };
// };


// lib/socket.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  orderID: string;
  orderNumber: string;
  totalAmount: number;
  deliveryFee: number;
  riderCommission: number;
  deliveryAddress: {
    area: string;
    city: string;
    houseNo?: string;
    road?: string;
  };
  itemCount: number;
  paymentMethod: string;
  createdAt: string;
  read: boolean;
  timestamp: string;
  area?: string;
  type?: "rider-order" | "admin-order";
  customerName?: string;
  customerPhone?: string;
  riderCount?: number;
  availableRiders?: Array<{
    id: string;
    userID?: string;
    name: string;
    phone?: string;
    status?: string;
    areas?: string[];
  }>;
}

export const useSocket = () => {
  const { data: session, status } = useSession();

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const isInitialized = useRef(false);

  const addNotification = (data: any) => {
    const notificationArea = data.area || data.deliveryAddress?.area || "Unknown";

    const newNotification: Notification = {
      id: data.orderID || data.orderId || Date.now().toString(),
      orderID: data.orderID || data.orderId,
      orderNumber: data.orderNumber || `ORD-${Date.now()}`,
      totalAmount: data.totalAmount || data.amount || 0,
      deliveryFee: data.deliveryFee || data.deliveryCharge || 0,
      riderCommission: data.riderCommission || data.commission || 0,
      deliveryAddress: data.deliveryAddress || { area: "Unknown", city: "Unknown" },
      itemCount: data.itemCount || data.items || 0,
      paymentMethod: data.paymentMethod || "cod",
      createdAt: data.createdAt || new Date().toISOString(),
      read: false,
      timestamp: new Date().toISOString(),
      area: notificationArea,
      type: data.type || "admin-order",
      customerName: data.customerName || "Customer",
      customerPhone: data.customerPhone || "N/A",
      availableRiders: data.availableRiders || [],
      riderCount: data.riderCount || 0,
    };

    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === newNotification.id);
      if (exists) return prev;
      return [newNotification, ...prev];
    });
    setUnreadCount((prev) => prev + 1);

    toast.success(
      `🆕 New Order in ${notificationArea}! #${newNotification.orderNumber} - ${newNotification.totalAmount} TK`,
      { duration: 5000, position: "top-right" },
    );

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(`🆕 New Order!`, {
        body: `Order #${newNotification.orderNumber} - ${newNotification.totalAmount} TK\n📍 Area: ${notificationArea}`,
        icon: "/admin-icon.png",
      });
    }

    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;
    if (status === "loading") return;

    // ✅ শুধু admin role হলেই socket connect করি
    if (status !== "authenticated" || session?.user?.role !== "admin") {
      setIsLoading(false);
      return;
    }

    const adminID = session.user.id;
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    console.log("🔌 [Admin] Connecting to socket server:", socketUrl);

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ [Admin] Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("admin-join", { adminID });
      console.log(`👨‍💼 Emitted admin-join with ID: ${adminID}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ [Admin] Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect" || reason === "transport close") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 [Admin] Socket connect_error:", error);
    });

    socket.on("admin-join-ack", (data: any) => {
      console.log("✅ [Admin] Join acknowledgment:", data);
    });

    // ✅ backend থেকে admin room এ broadcast হওয়া সব order notification
    socket.on("admin-new-order-notification", (data: any) => {
      console.log("👨‍💼 Admin new order notification:", data);
      addNotification({ ...data, type: "admin-order" });
    });

    socket.on("rider-status-change", (data: any) => {
      console.log("📡 Rider status change:", data);
    });

    socket.on("admin-no-rider-available", (data: any) => {
      console.log("⚠️ No rider available:", data);
      toast.error(
        `⚠️ No rider available for order #${data.orderNumber} in ${data.area}`,
        { duration: 5000, position: "top-right" },
      );
    });

    setIsLoading(false);
    isInitialized.current = true;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      isInitialized.current = false;
    };
    // ✅ পুরো `session` object কে dependency তে দেওয়া হয়নি — token refresh হলে
    // NextAuth প্রতিবার নতুন session object বানায় (একই user হলেও), যেটা এই effect
    // কে বারবার re-run করাতো (disconnect + reconnect প্রতি token-expiry cycle এ)।
    // এখন শুধু id/role (primitive) বদলালেই reconnect হবে।
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id, (session?.user as any)?.role]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return {
    isConnected,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};