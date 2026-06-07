// "use client";

// import React from "react";
// import Link from "next/link";
// import SectionHeading from "@/components/shared/SectionHeading";
// import ProductCard from "@/components/shared/ProductCard";

// // Swiper React কম্পোনেন্ট এবং মডিউল ইম্পোর্ট
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";

// // Swiper এর প্রয়োজনীয় CSS ফাইল
// import "swiper/css";
// import "swiper/css/pagination";

// // গ্রোসারি আইটেম অনুযায়ী প্রোডাক্ট ডাটা
// const dailyProducts = [
//   {
//     id: 101,
//     name: "Premium Nazirshail Rice (5kg)",
//     categoryName: "Rice & Pulse",
//     price: 420,
//     mrp: 450,
//     rating: 4.7,
//     reviews: 320,
//     image:
//       "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg",
//   },
//   {
//     id: 102,
//     name: "Organic Red Lentil (1kg)",
//     categoryName: "Rice & Pulse",
//     price: 130,
//     mrp: 150,
//     rating: 4.8,
//     reviews: 210,
//     image:
//       "https://images.pexels.com/photos/8105066/pexels-photo-8105066.jpeg",
//   },
//   {
//     id: 103,
//     name: "Fresh Red Tomato (1kg)",
//     categoryName: "Vegetables & Fruits",
//     price: 60,
//     mrp: 80,
//     rating: 4.9,
//     reviews: 150,
//     image:
//       "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",
//   },
//   {
//     id: 104,
//     name: "Fresh Onion (1kg)",
//     categoryName: "Vegetables & Fruits",
//     price: 70,
//     mrp: 90,
//     rating: 4.6,
//     reviews: 180,
//     image:
//       "https://images.pexels.com/photos/4197445/pexels-photo-4197445.jpeg",
//   },
//   {
//     id: 105,
//     name: "Soybean Oil (1L)",
//     categoryName: "Cooking Essentials",
//     price: 165,
//     mrp: 175,
//     rating: 4.8,
//     reviews: 450,
//     image:
//       "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg",
//   },
//   {
//     id: 106,
//     name: "Turmeric Powder (200g)",
//     categoryName: "Cooking Essentials",
//     price: 85,
//     mrp: 100,
//     rating: 4.7,
//     reviews: 200,
//     image:
//       "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg",
//   },
//   {
//     id: 107,
//     name: "Herbal Bathing Soap",
//     categoryName: "Personal Care",
//     price: 55,
//     mrp: 65,
//     rating: 4.9,
//     reviews: 310,
//     image:
//       "https://images.pexels.com/photos/6621460/pexels-photo-6621460.jpeg",
//   },
//   {
//     id: 108,
//     name: "Advanced Fabric Detergent (1kg)",
//     categoryName: "Personal Care",
//     price: 190,
//     mrp: 220,
//     rating: 4.8,
//     reviews: 290,
//     image:
//       "https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg",
//   },
// ];

// const DailyEssentials: React.FC = () => {
//   return (
//     <div className="container mx-auto px-4 py-16 daily-essentials-section">
//       {/* সেকশন হেডিং */}
//       <div className="mb-10 flex items-center justify-between">
//         <SectionHeading
//           description="Freshness delivered to your kitchen every day."
//           heading="Daily "
//           colorHeading="Essentials"
//         />

//         {/* View All বাটন */}
//         <Link
//           href="/shop/vegetables"
//           className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
//         >
//           View All
//         </Link>
//       </div>

//       {/* Swiper Slider */}
//       <Swiper
//         modules={[Pagination, Autoplay]}
//         spaceBetween={16}
//         slidesPerView={2}
//         watchSlidesProgress={true} // স্লাইডের প্রোগ্রেস ট্র্যাক করবে, ফলে স্মুথনেস বাড়ে
//         roundLengths={true} // পিক্সেলের ভগ্নাংশ (যেমন: 250.33px) রাউন্ড করে দেবে, কাঁপুনি কমাবে
//         loop={true} // Infinite loop অন করা হয়েছে যাতে শেষ প্রোডাক্টের পর আবার প্রথমটি আসে
//         speed={800} // স্লাইড ট্রানজিশন কতটা স্মুথ হবে (800ms)
//         pagination={{
//           clickable: true, // ডটে ক্লিক করলে ডিরেক্ট ওই স্লাইডে যাবে
//           dynamicBullets: true, // অনেক প্রোডাক্ট হলে ডটগুলো সুন্দরভাবে ছোট-বড় দেখাবে
//         }}
//         autoplay={{
//           delay: 3000,
//           disableOnInteraction: false,
//           pauseOnMouseEnter: true,
//         }}
//         breakpoints={{
//           640: {
//             slidesPerView: 3,
//             spaceBetween: 16,
//           },
//           710: {
//             slidesPerView: 4,
//             spaceBetween: 20,
//           },
//           1280: {
//             slidesPerView: 5,
//             spaceBetween: 24,
//           },
//         }}
//         className="w-full !pb-12" // নিচে ডটগুলোর বসার জায়গার জন্য !pb-12 দেওয়া হয়েছে
//       >
//         {dailyProducts.map((p) => (
//           <SwiperSlide key={p.id} className="h-auto">
//             <div className="h-full pb-2">
//               <ProductCard product={p} />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default DailyEssentials;




"use client";

import React from "react";
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { useGetProductsQuery } from "@/redux/api/productApi"; // আপনার সঠিক পাথ দিন

// Swiper ইম্পোর্ট
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const DailyEssentials: React.FC = () => {
  // এপিআই থেকে ডেটা ফেচিং (এখানে প্যারামস হিসেবে status বা limit দিতে পারেন)
  const { data, isLoading, isError } = useGetProductsQuery({ 
    limit: 10,
    status: 'active' 
  });
  
  const dailyProducts = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-16 daily-essentials-section">
      <div className="mb-10 flex items-center justify-between">
        <SectionHeading
          description="Freshness delivered to your kitchen every day."
          heading="Daily "
          colorHeading="Essentials"
        />

        <Link
          href="/shop"
          className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">Failed to load products.</div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          loop={true}
          speed={800}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            710: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="w-full !pb-12"
        >
          {dailyProducts.map((p: any) => (
            <SwiperSlide key={p._id} className="h-auto">
              <div className="h-full pb-2">
                <ProductCard product={p} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default DailyEssentials;