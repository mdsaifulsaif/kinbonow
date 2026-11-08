import { baseApi } from "./baseApi";

export interface IPromotionalBanner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  linkType?: "category" | "custom" | "none";
  categorySlug?: string;
  order?: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const promotionalBannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPromotionalBanners: builder.query<{
      success: boolean;
      message: string;
      data: IPromotionalBanner[];
    }, void>({
      query: () => ({
        url: "/promotional-banners/admin",
        method: "GET",
      }),
      providesTags: ["PromotionalBanners"],
    }),
    createPromotionalBanner: builder.mutation({
      query: (data) => ({
        url: "/promotional-banners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PromotionalBanners"],
    }),
    updatePromotionalBanner: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/promotional-banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PromotionalBanners"],
    }),
    deletePromotionalBanner: builder.mutation({
      query: (id: string) => ({
        url: `/promotional-banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PromotionalBanners"],
    }),
  }),
});

export const {
  useGetAdminPromotionalBannersQuery,
  useCreatePromotionalBannerMutation,
  useUpdatePromotionalBannerMutation,
  useDeletePromotionalBannerMutation,
} = promotionalBannerApi;

