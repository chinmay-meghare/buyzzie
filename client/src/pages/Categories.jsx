import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategories } from "../features/products/productSlice";
import CategoryGrid from "../components/layout/CategoryGrid";

const Categories = () => {

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[#ebebeb] to-[#9379fc] bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 text-center mb-12">
            Browse products by category
          </p>
        </div>
      </main> */}
      {/* CategoryGrid */}
      <CategoryGrid
        heading="Categories"
        subheading="Browse products by category"
      />
    </div>
  );
};

export default Categories;
