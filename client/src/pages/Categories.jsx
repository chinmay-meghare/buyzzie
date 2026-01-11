import React from "react";
import CategoryPreview from "../components/layout/CategoryPreview";
import useScrollRestoration from "../hooks/useScrollRestoration";

/**
 * Categories Page
 * Displays all product categories in a Bento grid layout
 */
const Categories = () => {
  useScrollRestoration();

  return (
    <div className="min-h-screen pt-24 bg-[#0a0a0a]">
      <CategoryPreview
        title="Categories"
        subtitle="Browse products by category"
      />
    </div>
  );
};

export default Categories;

