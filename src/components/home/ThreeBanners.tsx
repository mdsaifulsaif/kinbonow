"use client";

import React from 'react';
import Link from 'next/link';

const ThreeBanners = () => {
    // শুধুমাত্র টাইটেল এবং ব্যাকগ্রাউন্ড ইমেজ (যা আপনি public ফোল্ডারে রাখছেন)
    const banners = [
        {
            id: 1,
            title: "grab your favorite flavor",
            link: "/shop?filter=mac-cheese",
            bgImage: "/images/banner-mac.png" // প্রোডাক্টসহ পুরো ব্যাকগ্রাউন্ড ইমেজ
        },
        {
            id: 2,
            title: "make a refreshing choice",
            link: "/shop?filter=perrier",
            bgImage: "/images/banner-drinks.png" // প্রোডাক্টসহ পুরো ব্যাকগ্রাউন্ড ইমেজ
        },
        {
            id: 3,
            title: "bring out the good chips",
            link: "/shop?filter=chips",
            bgImage: "/images/banner-chips.png" // প্রোডাক্টসহ পুরো ব্যাকগ্রাউন্ড ইমেজ
        }
    ];

    return (
        <div className="py-12">
            {/* গ্লোবাল container ক্লাস */}
            <div className="container">
                {/* ৩ কলামের রেসপনসিভ গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <Link 
                            href={banner.link} 
                            key={banner.id}
                            className="group block relative rounded-[20px] overflow-hidden min-h-[220px] md:min-h-[240px] bg-cover bg-center transition-transform duration-300 hover:scale-[1.01]"
                            style={{ backgroundImage: `url(${banner.bgImage})` }}
                        >
                            {/* টেক্সট কন্টেইনার (বাম পাশে পজিশন করার জন্য) */}
                            <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-8 pr-1/2 max-w-[60%]">
                                {/* মেইন টাইটেল - গ্লোবাল Poppins ফন্ট */}
                                <h3 className="text-white text-[24px] md:text-[28px] font-bold leading-[1.1] tracking-tight capitalize group-hover:opacity-90 transition-opacity">
                                    {banner.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThreeBanners;