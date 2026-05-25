"use client";

import React from 'react';
import SectionHeading from '@/components/shared/SectionHeading';
import ProductCard from '@/components/shared/ProductCard';
import Link from 'next/link';

// সবজি ও প্রয়োজনীয় জিনিসের কম্বো ডাটা
const comboProducts = [
    { id: 301, name: 'Daily Veggie Combo (5kg)', categoryName: 'Combo', price: 450, mrp: 600, rating: 4.9, reviews: 142, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4d99?q=80&w=800' },
    { id: 302, name: 'Cooking Essentials Pack', categoryName: 'Combo', price: 850, mrp: 1100, rating: 4.8, reviews: 95, image: 'https://images.unsplash.com/photo-1583258296330-004ccb3f3032?q=80&w=800' },
    { id: 303, name: 'Breakfast Protein Kit', categoryName: 'Combo', price: 320, mrp: 400, rating: 4.7, reviews: 78, image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=800' },
    { id: 304, name: 'Fruit Medley Box', categoryName: 'Combo', price: 550, mrp: 750, rating: 4.9, reviews: 110, image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800' },
    { id: 305, name: 'Healthy Salad Combo', categoryName: 'Combo', price: 280, mrp: 350, rating: 4.6, reviews: 65, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800' },
];

const ComboDeals: React.FC = () => {
    return (
        <div className='container mx-auto px-4 py-16'>
            
            {/* হেডিং এবং বাটন সেকশন */}
            <div className="flex items-end justify-between mb-10 gap-4">
                <div className='flex-1'>
                    <SectionHeading
                        description="Save big with our handpicked value bundles."
                        heading="Best Value "
                        colorHeading="Combos"
                    />
                </div>
                
                <Link 
                    href="/shop/combos"
                    className="hidden sm:block bg-[#98EBB1] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#7cd899] transition-all duration-300 whitespace-nowrap"
                >
                    View All Combos
                </Link>
            </div>
            
            {/* প্রোডাক্ট গ্রিড */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                {comboProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {/* মোবাইলের জন্য নিচে বাটন */}
            <div className="sm:hidden text-center mt-8">
                <Link href="/shop/combos" className="inline-block bg-[#98EBB1] px-8 py-3 rounded-full text-sm font-bold">
                    View All Combos
                </Link>
            </div>
        </div>
    );
};

export default ComboDeals;