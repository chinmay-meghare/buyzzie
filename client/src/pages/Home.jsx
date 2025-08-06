import React from "react";
import Hero from "../components/layout/Hero";
import Navbar from "../components/common/Navbar";
import PromotionBanner from "../components/layout/PromotionBanner";
import CategoryPreview from "../components/layout/CategoryPreview";
import FeaturedProducts from "../components/layout/FeaturedProducts";
import SubscribeSection from "../components/layout/SubscribeSection";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <PromotionBanner />
      <CategoryPreview /> 
      <FeaturedProducts/>
      <SubscribeSection/>
      <Footer/>
    </div>
  );
}

export default Home;
