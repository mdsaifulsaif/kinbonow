"use client";

import React from 'react';
import SectionHeading from '@/components/shared/SectionHeading';
import ProductCard from '@/components/shared/ProductCard';
import Link from 'next/link';

const vegetableProducts = [
    { id: 201, name: 'Fresh Broccoli', categoryName: 'Vegetables', price: 120, mrp: 150, rating: 4.8, reviews: 85, image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f49a1?q=80&w=800' },
    { id: 202, name: 'Organic Carrots', categoryName: 'Vegetables', price: 50, mrp: 70, rating: 4.7, reviews: 112, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800' },
    { id: 203, name: 'Fresh Spinach', categoryName: 'Vegetables', price: 40, mrp: 55, rating: 4.9, reviews: 205, image: 'https://images.unsplash.com/photo-1576045057995-568d588576fb?q=80&w=800' },
    { id: 204, name: 'Bell Pepper Mix', categoryName: 'Vegetables', price: 180, mrp: 220, rating: 4.6, reviews: 94, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=800' },
    { id: 205, name: 'Farm Fresh Potato', categoryName: 'Vegetables', price: 30, mrp: 45, rating: 4.5, reviews: 310, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba658?q=80&w=800' },
     { id: 201, name: 'Fresh Broccoli', categoryName: 'Vegetables', price: 120, mrp: 150, rating: 4.8, reviews: 85, image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f49a1?q=80&w=800' },
    { id: 202, name: 'Organic Carrots', categoryName: 'Vegetables', price: 50, mrp: 70, rating: 4.7, reviews: 112, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800' },
    { id: 203, name: 'Fresh Spinach', categoryName: 'Vegetables', price: 40, mrp: 55, rating: 4.9, reviews: 205, image: 'https://images.unsplash.com/photo-1576045057995-568d588576fb?q=80&w=800' },
    { id: 204, name: 'Bell Pepper Mix', categoryName: 'Vegetables', price: 180, mrp: 220, rating: 4.6, reviews: 94, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=800' },
    { id: 205, name: 'Farm Fresh Potato', categoryName: 'Vegetables', price: 30, mrp: 45, rating: 4.5, reviews: 310, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba658?q=80&w=800' },
];

const FreshVegetableCorner: React.FC = () => {
    return (
        <div className='container mx-auto px-4 py-16'>
            
            {/* হেডিং এবং বাটন সেকশন - Flex Justify Between */}
            <div className="flex items-end justify-between mb-10 gap-4">
                <div className='flex-1'>
                    <SectionHeading
                        description="Hand-picked fresh vegetables from local farms."
                        heading="Fresh Vegetable "
                        colorHeading="Corner"
                    />
                </div>
                
                {/* View All বাটন */}
                <Link 
                    href="/shop/vegetables"
                    className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
                >
                    View All
                </Link>
            </div>
            
            {/* প্রোডাক্ট গ্রিড */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                {vegetableProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {/* মোবাইলের জন্য নিচে বাটন */}
            <div className="sm:hidden text-center mt-8">
                <Link href="/shop/vegetables" className="inline-block border border-black px-8 py-3 rounded-full text-sm font-medium">
                    View All
                </Link>
            </div>
        </div>
    );
};

export default FreshVegetableCorner;