import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Stats', 'Orders', 'Products', 'Users', 'Analytics', 'PageContent', 'SiteContent', 'Categories', 'Payments', 'Shipping', 'Coupons', 'Reviews', 'Brands', 'Complaints','Area'],
    endpoints: () => ({}),
});
