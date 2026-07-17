

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        credentials: 'include',
        prepareHeaders: async (headers) => {
            try {
                const session = await getSession();

                if (session?.accessToken) {
                    headers.set('authorization', `Bearer ${session.accessToken}`);
                }
            } catch (error) {
                console.error("Session fetch error in RTK Query:", error);
            }

            // ❌ Content-Type জোর করে বসানো বাদ দেওয়া হলো
            // fetchBaseQuery নিজে থেকেই JSON body হলে application/json বসায়,
            // আর FormData হলে browser নিজে multipart boundary বসায়।
            // ম্যানুয়ালি সেট করলে avatar upload ভেঙে যায়।

            return headers;
        },
    }),
    tagTypes: [
        'Stats', 'Orders', 'Products', 'Users', 'Analytics', 'PageContent',
        'SiteContent', 'Categories', 'Payments', 'Shipping', 'Coupons',
        'Reviews', 'Brands', 'Complaints', 'Area', 'Rider',
        'RiderApplication', 'User', 'StoreSetting', 'Riders', 'RiderProfile','Brand','Area','Dashboard','Payout'
    ],
    endpoints: () => ({}),
});






// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { RootState } from '../store';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// export const baseApi = createApi({
//     reducerPath: 'api',
//     baseQuery: fetchBaseQuery({
//         baseUrl: API_URL,
//         credentials: 'include', // cookies এর জন্য (যদি পরে দরকার হয়)
//         prepareHeaders: (headers, { getState }) => {
//             // Redux থেকে টোকেন নেওয়ার চেষ্টা করো
//             const token = (getState() as RootState).auth?.token || 
//                          localStorage.getItem('token');

//             // যদি টোকেন থাকে তাহলে Authorization Header সেট করো
//             if (token) {
//                 headers.set('authorization', `Bearer ${token}`);
//             }

//             // Content-Type সেট করো (FormData এর জন্য এটা অটো হ্যান্ডেল হয়)
//             if (!headers.has('Content-Type')) {
//                 headers.set('Content-Type', 'application/json');
//             }

//             return headers;
//         },
//     }),
//     tagTypes: [
//         'Stats', 
//         'Orders', 
//         'Products', 
//         'Users', 
//         'Analytics', 
//         'PageContent', 
//         'SiteContent', 
//         'Categories', 
//         'Payments', 
//         'Shipping', 
//         'Coupons', 
//         'Reviews', 
//         'Brands', 
//         'Complaints',
//         'Area',
//         'Rider', 
//         'RiderApplication',
//         'User'  ,
//         'StoreSetting'         // ← এটা যোগ করা হয়েছে (Register/Login এর জন্য)
//     ],
//     endpoints: () => ({}),
// });