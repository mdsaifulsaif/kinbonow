import {
  Hero,
  HomeCategory,
  PopularProducts,
  NewProducts,
  BlogSection,
  Support,
} from "@/components/home";
import DeliveryBanner from "@/components/home/DeliveryBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import PromoBanner from "@/components/home/PromoBanner";
import ThreeBanners from "@/components/home/ThreeBanners";
import TwoBanners from "@/components/home/TwoBanners";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeCategory />
      {/* <FeaturesSection /> */}
      <DeliveryBanner />
      <PopularProducts />
      <ThreeBanners />
      {/* <TwoBanners /> */}
      <NewProducts />
      <BlogSection />
      <Support />
    </>
  );
}
