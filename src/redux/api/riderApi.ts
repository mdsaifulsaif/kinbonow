import { baseApi } from "./baseApi";

const riderApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // ==================== RIDER APPLICATION ====================
    applyForRider: builder.mutation({
      query: (data: any) => ({
        url: "/rider/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RiderApplication"],
    }),

    getMyApplication: builder.query({
      query: () => ({
        url: "/rider/my-application",
        method: "GET",
      }),
      providesTags: ["RiderApplication"],
    }),

    getAllApplications: builder.query({
      query: (args: any = {}) => ({
        url: "/rider/admin/applications/all",
        method: "GET",
        params: args,
      }),
      providesTags: ["RiderApplication"],
    }),

    approveApplication: builder.mutation({
      query: (id: string) => ({
        url: `/rider/admin/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["RiderApplication", "Rider"],
    }),

    rejectApplication: builder.mutation({
      query: (id: string) => ({
        url: `/rider/admin/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["RiderApplication"],
    }),

    // ==================== RIDER MANAGEMENT ====================
    getMyProfile: builder.query({
      query: () => ({
        url: "/rider/my-profile",
        method: "GET",
      }),
      providesTags: ["Rider"],
    }),

    updateRiderStatus: builder.mutation({
      query: (data: any) => ({
        url: "/rider/status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Rider"],
    }),

    updateLocation: builder.mutation({
      query: (data: any) => ({
        url: "/rider/location",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Rider"],
    }),

    getAllRiders: builder.query({
      query: (args: any = {}) => ({
        url: "/rider/admin/roder/all",
        method: "GET",
        params: args,
      }),
      providesTags: ["Rider"],
    }),

    getRiderById: builder.query({
      query: (id: string) => ({
        url: `/rider/admin/${id}`,
        method: "GET",
      }),
      providesTags: (_result: any, _error: any, id: string) => [
        { type: "Rider", id },
      ],
    }),

    updateAssignedAreas: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/rider/admin/${id}/areas`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Rider"],
    }),

    toggleActiveStatus: builder.mutation({
      query: ({ id, isActive }: { id: string; isActive: boolean }) => ({
        url: `/rider/admin/${id}/active-status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["Rider"],
    }),
  }),
});

export const {
  useApplyForRiderMutation,
  useGetMyApplicationQuery,
  useGetAllApplicationsQuery,
  useApproveApplicationMutation,
  useRejectApplicationMutation,

  useGetMyProfileQuery,
  useUpdateRiderStatusMutation,
  useUpdateLocationMutation,
  useGetAllRidersQuery,
  useGetRiderByIdQuery,
  useUpdateAssignedAreasMutation,
  useToggleActiveStatusMutation,
} = riderApi;
