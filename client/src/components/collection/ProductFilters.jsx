import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  clearFilters,
  fetchCategories,
} from "../../features/products/productSlice";

const ProductFilters = () => {
  const dispatch = useDispatch();
  const { categories, filters, categoriesLoading } = useSelector((state) => state.products);

  // Ensure filters and categories are defined
  const safeFilters = filters || {
    q: "",
    category: [],
    minPrice: null,
    maxPrice: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [localFilters, setLocalFilters] = useState({
    q: safeFilters.q,
    category: safeFilters.category,
    minPrice: safeFilters.minPrice,
    maxPrice: safeFilters.maxPrice,
    sortBy: safeFilters.sortBy,
    sortOrder: safeFilters.sortOrder,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCategoryChange = (categorySlug) => {
    const newCategories = localFilters.category.includes(categorySlug)
      ? localFilters.category.filter((cat) => cat !== categorySlug)
      : [...localFilters.category, categorySlug];

    handleFilterChange("category", newCategories);
  };

  const handleSortChange = (sortBy) => {
    let sortOrder = "asc";

    if (sortBy === "price") {
      sortOrder =
        localFilters.sortBy === "price" && localFilters.sortOrder === "asc"
          ? "desc"
          : "asc";
    } else if (sortBy === "rating") {
      sortOrder = "desc";
    } else if (sortBy === "createdAt") {
      sortOrder = "desc";
    } else {
      sortOrder = "asc";
    }

    handleFilterChange("sortBy", sortBy);
    handleFilterChange("sortOrder", sortOrder);
  };

  const applyFilters = () => {
    console.log("Applying filters:", localFilters);
    dispatch(setFilters(localFilters));
    dispatch(fetchProducts(localFilters));
  };

  const handleClearFilters = () => {
    console.log("Clearing filters");
    dispatch(clearFilters());
    dispatch(fetchProducts({
      q: "",
      category: [],
      minPrice: null,
      maxPrice: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    }));
  };

  // Debug logging
  console.log("ProductFilters render:", {
    categories,
    safeCategories,
    localFilters,
  });

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-50 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search products..."
            value={localFilters.q || ""}
            onChange={(e) => handleFilterChange("q", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-50 mb-2">
            Categories
          </label>
          <div className="space-y-2 max-h-32">
            {safeCategories.length > 0 ? (
              safeCategories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      localFilters.category &&
                      localFilters.category.includes(category.slug)
                    }
                    onChange={() => handleCategoryChange(category.slug)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-50">{category.name}</span>
                </label>
              ))
            ) : categoriesLoading ? (
              <div className="text-sm text-gray-50">Loading categories...</div>
            ) : (
              <div className="text-sm text-gray-50">No categories found</div>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-50 mb-2">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ""}
              onChange={(e) =>
                handleFilterChange("minPrice", e.target.value || null)
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange("maxPrice", e.target.value || null)
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-50 mb-2">
            Sort By
          </label>
          <select
            value={`${localFilters.sortBy || "createdAt"}-${
              localFilters.sortOrder || "desc"
            }`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              handleSortChange(sortBy);
            }}
            className="w-full px-3 py-2 border border-gray-300 bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title-asc">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="createdAt-desc">Newest</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-600 text-gray-50 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
