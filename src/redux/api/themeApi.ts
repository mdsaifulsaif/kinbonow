import { baseApi } from "./baseApi";

export interface IThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  fontFamily: string;
  headingFont: string;
  darkMode: boolean;
  _id?: string;
  updatedAt?: string;
}

export const themeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getThemeSettings: builder.query<{ success: boolean; data: IThemeConfig }, void>({
      query: () => ({
        url: "/settings/theme",
        method: "GET",
      }),
      providesTags: ["ThemeSetting"],
    }),

    updateThemeSettings: builder.mutation<
      { success: boolean; message: string; data: IThemeConfig },
      Partial<IThemeConfig>
    >({
      query: (body) => ({
        url: "/settings/theme",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ThemeSetting"],
    }),
  }),
});

export const {
  useGetThemeSettingsQuery,
  useUpdateThemeSettingsMutation,
} = themeApi;
