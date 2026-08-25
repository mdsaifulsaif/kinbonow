

// orderApi.ts
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Admin: সব অর্ডার পাওয়া (প্যারামিটার সহ)
    getAdminOrders: builder.query({
      query: (params) => {
        // params থেকে ফিল্টার বের করা
        const { page = 1, limit = 10, status, search, deliveryType } = params || {};
        
        // URL বিল্ড করা
        let url = `/order/admin/all?page=${page}&limit=${limit}`;
        
        // অতিরিক্ত ফিল্টার যোগ করা
        if (status && status !== 'all') {
          url += `&status=${status}`;
        }
        if (search) {
          url += `&search=${search}`;
        }
        if (deliveryType) {
          url += `&deliveryType=${deliveryType}`;
        }
        
        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    // ✅ Admin: অর্ডার স্ট্যাটস
    getOrderStats: builder.query({
      query: () => ({
        url: "/order/admin/stats",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Admin: সিঙ্গেল অর্ডার ডিটেইলস
    getAdminOrderById: builder.query({
      query: (id) => ({
        url: `/order/admin/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Admin: অর্ডার স্ট্যাটাস আপডেট
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/admin/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Admin: পেমেন্ট স্ট্যাটাস আপডেট
    updatePaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/order/admin/${id}/payment`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Admin: নোট যোগ করা
    addAdminNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `/order/admin/${id}/note`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ User: অর্ডার তৈরি
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order/place-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ User: আমার অর্ডার
    getMyOrders: builder.query({
      query: (params) => ({
        url: "/order/my-orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // ✅ User: সিঙ্গেল অর্ডার
    getMyOrderById: builder.query({
      query: (id) => ({
        url: `/order/my-orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // ✅ User: অর্ডার ক্যান্সেল
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/order/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  // Admin hooks
  useGetAdminOrdersQuery,
  useGetOrderStatsQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useAddAdminNoteMutation,
  
  // User hooks
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;