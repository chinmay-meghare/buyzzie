import React from "react";
import Hero from "../components/layout/Hero";
import PromotionBanner from "../components/layout/PromotionBanner";
import CategoryPreview from "../components/layout/CategoryPreview";
import FeaturedProducts from "../components/layout/FeaturedProducts";
import SubscribeSection from "../components/layout/SubscribeSection";
import useScrollRestoration from "../hooks/useScrollRestoration";

function Home() {
  useScrollRestoration();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Hero />
      <PromotionBanner />
      <CategoryPreview
        title="Shop by Category"
        subtitle="Explore our carefully curated collections designed for the modern lifestyle"
      />
      <FeaturedProducts />
      <SubscribeSection />
    </div>
  );
}

export default Home;