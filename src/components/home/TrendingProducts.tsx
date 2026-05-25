"use client";

import ProductCard from '@/components/shared/topProdcutCard';


const products = [
    { id: 1, name: 'Pastine Mellin Filid', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.5, reviews: 120, image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=200' },
    { id: 2, name: 'Di Grano Tenero', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.2, reviews: 85, image: 'https://images.unsplash.com/photo-1574784267442-793313936082?q=80&w=200' },
    { id: 3, name: 'Mellin Grano Tenero', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.8, reviews: 200, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=200' },
    { id: 4, name: 'Grano Tenero', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.0, reviews: 45, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=200' },
    { id: 5, name: 'Jack Froot', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.7, reviews: 110, image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=200' },
    { id: 6, name: 'Fresh Mango', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.9, reviews: 300, image: 'https://images.unsplash.com/photo-1553279768-865429fa001d?q=80&w=200' },
    { id: 7, name: 'Fresh Juice', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.6, reviews: 90, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=200' },
    { id: 8, name: 'Pastine Mellin', categoryName: '500g Pack', price: 36.00, mrp: 48.00, rating: 4.4, reviews: 60, image: 'https://images.unsplash.com/photo-1574784267442-793313936082?q=80&w=200' },
];

const TrendingProducts = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Top Trending Products</h2>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
            <div key={product.id} className="h-full">
                {/* এখানে আপনার মডিফাইড ProductCard টি কল করা হয়েছে */}
                <ProductCard product={product} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;