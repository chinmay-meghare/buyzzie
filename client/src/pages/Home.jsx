import React from "react";
import Hero from "../components/layout/Hero";
import Navbar from "../components/layout/Navbar";
import PromotionBanner from "../components/layout/PromotionBanner";
import CategoryPreview from "../components/layout/CategoryPreview";
import ProductGrid from "../components/layout/ProductGrid";
import SubscribeSection from "../components/layout/SubscribeSection";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <PromotionBanner />
      <CategoryPreview /> 
      <ProductGrid/>
      <SubscribeSection/>
      <Footer/>
    </div>
  );
}

export default Home;
