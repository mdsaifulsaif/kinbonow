"use client";

import React from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import Link from "next/link";

// গ্রোসারি আইটেম অনুযায়ী নতুন প্রোডাক্ট ডাটা
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
      "https://images.unsplash.com/photo-1592924357228-9564da13a56a?q=80&w=800",
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
      "https://images.unsplash.com/photo-1610399555926-8113f412431d?q=80&w=800",
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
      "https://images.unsplash.com/photo-1586201375761-83865001e88c?q=80&w=800",
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
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800",
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
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800",
  },
];

const DailyEssentials: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* সেকশন হেডিং - আপনার গ্লোবাল কম্পোনেন্ট অনুযায়ী */}
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

      {/* প্রোডাক্ট গ্রিড */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {dailyProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default DailyEssentials;
