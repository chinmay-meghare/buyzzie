import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../products/productSlice";
import ProductFilters from "../components/collection/ProductFilters";
import ProductCard from "../components/collection/ProductCard";
import Pagination from "../components/collection/Pagination";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function Collection() {
  const dispatch = useDispatch();
  const { products, meta, filters, loading, error, isInitialLoad } =
    useSelector((state) => state.products);

  useEffect(() => {
    // Fetch both categories and products on initial mount
    dispatch(fetchCategories());
    dispatch(fetchProducts(filters));
  }, [dispatch]);

  // Handle filter changes
  useEffect(() => {
    if (filters) {
      dispatch(fetchProducts(filters));
    }
  }, [dispatch, filters]);

  // Handle loading state
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-800">
        <Navbar />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-100 mb-6">
              Product Collection
            </h1>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Product Collection
            </h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure products and meta are defined
  const productsArray = products || [];
  const metaData = meta || { total: 0 };
  const filtersData = filters || { q: "", category: [] };

  // Debug logging
  console.log("Collection render:", { productsArray, metaData, filtersData });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-50 mb-6">
            Product Collection
          </h1>

          {/* Filters */}
          <ProductFilters />

          {/* Results Summary */}
          <div className="mb-6 text-sm text-gray-600">
            Showing {productsArray.length} of {metaData.total} products
            {filtersData.q && ` for "${filtersData.q}"`}
            {filtersData.category &&
              filtersData.category.length > 0 &&
              ` in ${filtersData.category.join(", ")}`}
          </div>

          {/* Products Grid */}
          {productsArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {productsArray.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Collection;
