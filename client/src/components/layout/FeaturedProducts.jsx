import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../collection/ProductCard";
import { fetchProducts } from "../../features/products/productSlice";

const FeaturedProducts = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productsArray = products || [];

  const featuredProducts = React.useMemo(() => {
    if (!productsArray.length) return [];

    const shuffled = [...productsArray].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 6);
  }, [productsArray]);

  if (loading && (!products || products.length === 0)) {
    return (
      <section className="py-24">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-[#ebebeb] to-[#9379fc] bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 text-center mb-12">
              Handpicked items that define the future of style and technology
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <>
        <section className="py-24">
          <div className="px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                <span className="bg-gradient-to-r from-[#ebebeb] to-[#9379fc] bg-clip-text text-transparent">
                  Featured Products
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 text-center mb-12">
                Handpicked items that define the future of style and technology
              </p>
            </div>
            <div className="text-red-500">{error}</div>
          </div>
        </section>
      </>
    );
  }

  return (
    <section className="py-24">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-[#ebebeb] to-[#9379fc] bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 text-center mb-12">
            Handpicked items that define the future of style and technology
          </p>
        </div>

        {/* grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
        <div className="">
          {productsArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">Try reloading the page</p>
            </div>
          )}
        </div>
      </div>
      <div className="py-8 flex flex-col justify-center items-center">
        <Link to="/collection">
          <button className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-lg font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
            View All Products
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
