import React from "react";
import CategoryPreview from "../components/layout/CategoryPreview";

/**
 * Categories Page
 * Displays all product categories in a Bento grid layout
 */
const Categories = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <CategoryPreview
        title="Categories"
        subtitle="Browse products by category"
      />
    </div>
  );
};

export default Categories;

