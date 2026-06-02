"use client";

import React from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const categories = [
  { id: 1, name: "Organic Vegetable", image: "/cat/h1_cat-1.png" },
  { id: 2, name: "Fresh Strawberry", image: "/cat/h1_cat-2.png" },
  { id: 3, name: "Organic Juice", image: "/cat/h1_cat-3.png" },
  { id: 4, name: "Potato Chips", image: "/cat/h1_cat-4.png" },
  { id: 5, name: "Fresh Orange", image: "/cat/h1_cat-5.png" },
  { id: 6, name: "Packaged Snacks", image: "/cat/h1_cat-4.png" },
  { id: 7, name: "Organic Atta", image: "/cat/h1_cat-1.png" },
  { id: 8, name: "Soft Drinks", image: "/cat/h1_cat-2.png" },
  { id: 9, name: "Fresh Melon", image: "/cat/h1_cat-1.png" },
  { id: 10, name: "Smile Chips", image: "/cat/h1_cat-3.png" },
];

const HomeCategory = () => {
  return (
    <div className="pb-10 pt-4">
      <div className="container">
        {/* Swiper Slider কনফিগারেশন */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={12} // মোবাইলে সামান্য গ্যাপ কমানো হয়েছে (১২px), বড় স্ক্রিনে ব্রেকপয়েন্টে ১৬px করা হয়েছে
          slidesPerView={3} // পরিবর্তন: মোবাইলে এখন একবারে ৩টি কার্ড দেখাবে
          slidesPerGroup={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          // রেসপনসিভ ব্রেকপয়েন্টস
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 16,
            },
          }}
          className="w-full"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link href={`/shop?category=${category.id}`} className="block">
                {/* ক্যাটাগরি কার্ড: মোবাইলে হাইট (min-h-[150px]) এবং প্যাডিং (p-2.5) কিছুটা কমানো হয়েছে */}
                <div className="group bg-white border border-gray-100 sm:border-gray-200 rounded-md p-2.5 sm:p-4 flex flex-col items-center justify-between text-center min-h-[150px] sm:min-h-[200px] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300 cursor-pointer">
                  {/* ইমেজ কন্টেইনার: মোবাইলের জন্য h-20 এবং বড় স্ক্রিনে h-28 */}
                  <div className="w-full h-20 sm:h-28 flex items-center justify-center mb-2 sm:mb-4 p-1 sm:p-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                   
                    />
                  </div>

                  {/* টেক্সট এরিয়া: মোবাইলে টেক্সট সাইজ text-xs (১২px) করা হয়েছে */}
                  <div className="mt-auto w-full">
                    <h3
                      style={{ color: "var(--color-text-primary)" }}
                      className="font-bold sm:font-semibold text-xs sm:text-[14px] leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-2"
                    >
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCategory;
