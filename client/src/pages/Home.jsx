import React from "react";
import Hero from "../components/layout/Hero";
import PromotionBanner from "../components/layout/PromotionBanner";
import CategoryPreview from "../components/layout/CategoryPreview";
import FeaturedProducts from "../components/layout/FeaturedProducts";
import SubscribeSection from "../components/layout/SubscribeSection";

function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Hero />
      <PromotionBanner />
      <CategoryPreview />
      <FeaturedProducts />
      <SubscribeSection />
    </div>
  );
}

export default Home;
