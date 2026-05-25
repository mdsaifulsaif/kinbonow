"use client";

import React from "react";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/slices/cartSlice";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  mrp?: number;
  discount?: number | string;
  rating: number;
  reviews: number;
  categoryName?: string;
}

interface ProductCardProps {
  product: Product;
}

const topProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        image: product.image,
        category: product.categoryName || "General",
      }),
    );
  };

  const discountPercentage = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="border border-gray-100 rounded-lg p-3 flex gap-4 hover:shadow-lg transition-all duration-300 bg-white items-center h-full">
        {/* ইমেজ কন্টেইনার (বামে) */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          {/* ডিসকাউন্ট ব্যাজ */}
          {discountPercentage !== null && discountPercentage > 0 && (
            <span className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
              {discountPercentage}% Off
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* টেক্সট কন্টেন্ট (ডানে) */}
        <div className="flex flex-col justify-center flex-1 overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-400 mb-1.5">
            {product.categoryName || "500g Pack"}
          </p>

          <div className="flex items-center justify-between mt-1">
            <div>
              <span className="text-lg font-bold text-red-600 block">
                ৳{product.price.toLocaleString()}
              </span>
              {product.mrp && (
                <span className="text-[11px] text-gray-400 line-through">
                  ৳{product.mrp.toLocaleString()}
                </span>
              )}
            </div>

            {/* অ্যাড টু কার্ট বাটন */}
            <button
              onClick={handleAddToCart}
              className="bg-gray-900 text-white p-2 rounded-md hover:bg-[var(--color-primary)] transition-colors"
            >
              <FiShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default topProductCard;
