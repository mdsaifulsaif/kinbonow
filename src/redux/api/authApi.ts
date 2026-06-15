import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // ==================== AUTH ====================
    registerUser: builder.mutation({
      query: (data: any) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation({
      query: (data: any) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // ==================== PROFILE ====================
    getMe: builder.query({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data: any) => {
        // FormData হলে স্পেশাল হ্যান্ডেলিং
        return {
          url: "/auth/update-profile",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;