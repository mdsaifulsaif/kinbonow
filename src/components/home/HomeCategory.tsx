
"use client";

import React from 'react';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';


import 'swiper/css';


const categories = [
    { id: 1, name: 'Organic Vegetable', image: '/cat/h1_cat-1.png' },
    { id: 2, name: 'Fresh Strawberry', image: '/cat/h1_cat-2.png' },
    { id: 3, name: 'Organic Juice', image: '/cat/h1_cat-3.png' },
    { id: 4, name: 'Potato Chips', image: '/cat/h1_cat-4.png' },
    { id: 5, name: 'Fresh Orange', image: '/cat/h1_cat-5.png' },
    { id: 6, name: 'Packaged Snacks', image: '/cat/h1_cat-4.png' },
    { id: 7, name: 'Organic Atta', image: '/cat/h1_cat-1.png' },
    { id: 8, name: 'Soft Drinks', image: '/cat/h1_cat-2.png' },
    { id: 9, name: 'Fresh Melon', image: '/cat/h1_cat-1.png' },
    { id: 10, name: 'Smile Chips', image: '/cat/h1_cat-3.png' },
];

const HomeCategory = () => {
    return (
        // গ্লোবাল ব্যাকগ্রাউন্ড টোকেন এবং প্যাডিং
        <div className='py-16'>
            <div className='container'>
                
                {/* Swiper Slider কনফিগারেশন */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={16} // কার্ডগুলোর ভেতরের গ্যাপ
                    slidesPerView={2} // মোবাইলে একবারে ২টি কার্ড দেখাবে
                    slidesPerGroup={1} // ১টি করে কার্ড স্লাইড হবে
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    // রেসপনসিভ ব্রেকপয়েন্টস (সর্বোচ্চ ৬টি কলাম লক করা হয়েছে)
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            slidesPerGroup: 1,
                        },
                        768: {
                            slidesPerView: 4,
                            slidesPerGroup: 1,
                        },
                        1024: {
                            slidesPerView: 5,
                            slidesPerGroup: 1,
                        },
                        1280: {
                            slidesPerView: 6, // বড় মনিটরে বা ডেক্সটপে সর্বোচ্চ ৬টি কার্ড দেখাবে
                            slidesPerGroup: 1,
                        },
                    }}
                    className="w-full"
                >
                    {categories.map(category => (
                        <SwiperSlide key={category.id}>
                            <Link href={`/shop?category=${category.id}`} className="block">
                                
                                {/* ক্যাটাগরি কার্ড: সেন্ট্রাল অ্যালাইনমেন্ট, ক্লিন বর্ডার ও ট্রানজিশন */}
                                <div className='group bg-white border border-gray-200 rounded-md p-4 flex flex-col items-center justify-between text-center min-h-[200px] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300 cursor-pointer'>
                                    
                                    {/* ইমেজ কন্টেইনার */}
                                    <div className='w-full h-28 flex items-center justify-center mb-4 p-2'>
                                        <img 
                                            src={category.image} 
                                            alt={category.name} 
                                            className='max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300'
                                        />
                                    </div>

                                    {/* টেক্সট এরিয়া */}
                                    <div className="mt-auto">
                                        <h3 
                                            style={{ color: 'var(--color-text-primary)' }} 
                                            className='font-semibold text-[14px] leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-2'
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