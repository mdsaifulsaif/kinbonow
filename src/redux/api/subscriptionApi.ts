import { baseApi } from "./baseApi";

export interface SubscriptionItem {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  area?: string;
  deliveryInstructions?: string;

  productID: {
    _id: string;
    name: string;
    thumbnail: string;
    regularPrice: number;
    salePrice?: number;
  } | string;
  productName: string;
  productThumbnail?: string;
  variantName?: string;
  quantity: number;

  regularPrice: number;
  discountedPrice: number;
  deliveryFee: number;
  totalPerDelivery: number;

  frequency: "weekly" | "monthly" | "bi-weekly";
  preferredDeliveryDay?: string;
  startDate: string;
  nextDeliveryDate: string;
  lastDeliveryDate?: string;
  deliveriesCompleted: number;

  paymentPreference: "cod" | "bkash" | "nagad";
  status: "active" | "paused" | "cancelled" | "completed";

  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  paused: number;
  cancelled: number;
  dueThisWeek: number;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<
      { success: boolean; meta: any; data: SubscriptionItem[] },
      Record<string, any>
    >({
      query: (params) => ({
        url: "/subscriptions",
        method: "GET",
        params,
      }),
      providesTags: ["Subscriptions"],
    }),

    getSubscriptionStats: builder.query<{ success: boolean; data: SubscriptionStats }, void>({
      query: () => ({
        url: "/subscriptions/stats",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),

    getSubscriptionById: builder.query<{ success: boolean; data: SubscriptionItem }, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Subscriptions", id }],
    }),

    toggleSubscriptionStatus: builder.mutation<
      any,
      { id: string; status: "active" | "paused" | "cancelled" }
    >({
      query: ({ id, status }) => ({
        url: `/subscriptions/${id}/toggle-status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    updateSubscription: builder.mutation<any, { id: string; data: Partial<SubscriptionItem> }>({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    deleteSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionStatsQuery,
  useGetSubscriptionByIdQuery,
  useToggleSubscriptionStatusMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi;
