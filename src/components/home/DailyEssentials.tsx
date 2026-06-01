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
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800", // তাজা লাল টমেটো
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
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800", // একদম ফ্রেশ লাল আপেল
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
      "https://images.unsplash.com/photo-1536304997881-a372c179924b?q=80&w=800", // চাল/ভাত এর রিয়েল লাইভ শট
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
      "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=800", // তাজা কাঁচা মাছ
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
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=800", // ঝুড়িতে রাখা ফার্মের ফ্রেশ ডিম
  },
  // {
  //   id: 106,
  //   name: "Premium Liquid Milk (1L)",
  //   categoryName: "Dairy",
  //   price: 90,
  //   mrp: 100,
  //   rating: 4.9,
  //   reviews: 280,
  //   image:
  //     "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800", // গ্লাসে ঢালা ফ্রেশ তরল দুধ
  // },
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
