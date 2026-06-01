"use client";

import React from "react";
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";

// Swiper React কম্পোনেন্ট এবং মডিউল ইম্পোর্ট
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper এর প্রয়োজনীয় CSS ফাইল
import "swiper/css";
import "swiper/css/pagination";

// গ্রোসারি আইটেম অনুযায়ী প্রোডাক্ট ডাটা
const dailyProducts = [
  {
    id: 101,
    name: "Fresh Organic Tomato",
    categoryName: "Vegetables",
    price: 60,
    mrp: 80,
    rating: 4.9,
    reviews: 150,
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800",
  },
  {
    id: 102,
    name: "Red Delicious Apple",
    categoryName: "Fruits",
    price: 220,
    mrp: 260,
    rating: 4.8,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800",
  },
  {
    id: 103,
    name: "Premium Nazirshail Rice",
    categoryName: "Grains",
    price: 85,
    mrp: 95,
    rating: 4.7,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1536304997881-a372c179924b?q=80&w=800",
  },
  {
    id: 104,
    name: "Fresh Rohu Fish",
    categoryName: "Fish & Meat",
    price: 350,
    mrp: 400,
    rating: 4.6,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=800",
  },
  {
    id: 105,
    name: "Farm Fresh Egg (12pcs)",
    categoryName: "Dairy",
    price: 150,
    mrp: 180,
    rating: 4.9,
    reviews: 450,
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=800",
  },
  {
    id: 106,
    name: "Premium Liquid Milk (1L)",
    categoryName: "Dairy",
    price: 90,
    mrp: 100,
    rating: 4.9,
    reviews: 280,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800",
  },
];

const DailyEssentials: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 daily-essentials-section">
      {/* সেকশন হেডিং */}
      <div className="mb-10 flex items-center justify-between">
        <SectionHeading
          description="Freshness delivered to your kitchen every day."
          heading="Daily "
          colorHeading="Essentials"
        />

        {/* View All বাটন */}
        <Link
          href="/shop/vegetables"
          className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
        >
          View All
        </Link>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        watchSlidesProgress={true} // স্লাইডের প্রোগ্রেস ট্র্যাক করবে, ফলে স্মুথনেস বাড়ে
        roundLengths={true} // পিক্সেলের ভগ্নাংশ (যেমন: 250.33px) রাউন্ড করে দেবে, কাঁপুনি কমাবে
        loop={true} // Infinite loop অন করা হয়েছে যাতে শেষ প্রোডাক্টের পর আবার প্রথমটি আসে
        speed={800} // স্লাইড ট্রানজিশন কতটা স্মুথ হবে (800ms)
        pagination={{
          clickable: true, // ডটে ক্লিক করলে ডিরেক্ট ওই স্লাইডে যাবে
          dynamicBullets: true, // অনেক প্রোডাক্ট হলে ডটগুলো সুন্দরভাবে ছোট-বড় দেখাবে
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          710: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
        }}
        className="w-full !pb-12" // নিচে ডটগুলোর বসার জায়গার জন্য !pb-12 দেওয়া হয়েছে
      >
        {dailyProducts.map((p) => (
          <SwiperSlide key={p.id} className="h-auto">
            <div className="h-full pb-2">
              <ProductCard product={p} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DailyEssentials;
