import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import CategoryGrid from "./CategoryGrid";

const CategoryPreview = () => {
  return (
    <section className="w-full bg-[#10318] py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* CategoryGrid */}
        <CategoryGrid
          heading="Shop by Category"
          subheading="Explore our carefully curated collections designed for the modern lifestyle"
        />
      </div>
    </section>
  );
};

export default CategoryPreview;
