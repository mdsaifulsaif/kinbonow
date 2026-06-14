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
};

export default nextConfig;