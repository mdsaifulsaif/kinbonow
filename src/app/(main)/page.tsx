import {
  Hero,
  HomeCategory,
  PopularProducts,
  NewProducts,
  BlogSection,
  Support,
} from "@/components/home";
import ComboDeals from "@/components/home/ComboDeals";
import DailyEssentials from "@/components/home/DailyEssentials";
import DeliveryBanner from "@/components/home/DeliveryBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import FreshVegetableCorner from "@/components/home/FreshVegetableCorner";
import PromoBanner from "@/components/home/PromoBanner";
import ThreeBanners from "@/components/home/ThreeBanners";
import TrendingProducts from "@/components/home/TrendingProducts";
import TwoBanners from "@/components/home/TwoBanners";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeCategory />
      <DeliveryBanner />
      <DailyEssentials />
      <FreshVegetableCorner />
      <ComboDeals />
      <ThreeBanners />
      <TrendingProducts />
      {/* <TwoBanners /> */}
      <NewProducts />
      <BlogSection />
      <Support />
    </>
  );
}
