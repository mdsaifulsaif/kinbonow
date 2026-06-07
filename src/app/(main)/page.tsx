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
import FreshVegetableCorner from "@/components/home/FreshVegetableCorner";
import ThreeBanners from "@/components/home/ThreeBanners";

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
      <Support />
    </>
  );
}
