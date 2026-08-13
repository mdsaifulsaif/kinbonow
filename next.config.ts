// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   images: {
//     domains: [
//       "images.unsplash.com",
//       "res.cloudinary.com",
//     ],
//     // ভবিষ্যতে আরও ডোমেইন যোগ করতে সুবিধা হবে
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//       },
//     ],
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
    ],
    // ভবিষ্যতে আরও ডোমেইন যোগ করতে সুবিধা হবে
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // ✅ ডিফল্ট রুট / থেকে /login এ রিডাইরেক্ট করার জন্য এটি যোগ করুন
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;