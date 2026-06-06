import { baseApi } from './baseApi';

export const unitApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // সব ইউনিট গেট (Get All Units) করার কুয়েরি
        getUnits: builder.query({
            query: (params) => ({
                url: '/unit', // 
                method: 'GET',
                params,
            }),
            providesTags: ['Units' as any], // ক্যাশ ক্লিয়ার ও ট্র্যাকিং এর জন্য ট্যাগ
        }),
        // নির্দিষ্ট কোনো ইউনিট আইডি দিয়ে গেট করার কুয়েরি (ভবিষ্যতের জন্য বোনাস)
        getUnitById: builder.query({
            query: (id) => `/unit/${id}`,
            providesTags: (result, error, id) => [{ type: 'Units' as any, id }],
        }),
    }),
});

// আপনার ফ্রন্টএন্ড ফর্ম বা কম্পোনেন্টে ব্যবহারের জন্য হুক এক্সপোর্ট
export const {
    useGetUnitsQuery,
    useGetUnitByIdQuery,
} = unitApi;