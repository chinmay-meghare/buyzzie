import { useState } from "react";

// List of product categories (not used anymore, but keeping for reference if needed later)
const categories = [
  "All",
  "Clothes",
  "Electronics",
  "Shoes",
  "Furniture",
  "Misc",
];

// Base mock products for demonstration
const baseProducts = [
  // Each product is an object with details like name, price, category, etc.
  {
    id: 1,
    name: "Urban Streetwear Hoodie",
    price: 89,
    originalPrice: 120,
    image: "/placeholder.svg?height=400&width=400",
    category: "Clothes",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isSale: true,
    description: "Premium cotton blend hoodie with modern streetwear design",
  },
  // ... (other base products omitted for brevity, but all are similar objects)
  {
    id: 12,
    name: "Leather Boots",
    price: 189,
    originalPrice: 220,
    image: "/placeholder.svg?height=400&width=400",
    category: "Shoes",
    rating: 4.8,
    reviews: 112,
    isNew: true,
    isSale: true,
    description: "Premium leather boots with timeless design",
  },
];

// Generate a larger list of products (keeping this as your "manual API" data source)
const allProducts = [
  ...baseProducts,
  ...Array.from({ length: 36 }, (_, i) => ({
    id: 13 + i,
    name: `Product ${13 + i}`,
    price: Math.floor(Math.random() * 300) + 50,
    originalPrice: Math.floor(Math.random() * 400) + 100,
    image: "/placeholder.svg?height=400&width=400",
    category:
      categories[1 + Math.floor(Math.random() * (categories.length - 1))],
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    reviews: Math.floor(Math.random() * 200) + 10,
    isNew: Math.random() > 0.7,
    isSale: Math.random() > 0.6,
    description: `Description for product ${13 + i}`,
  })),
];

// Main Collection component (simplified version)
const Collection = () => {
  // We're using the mock data directly as our "manual API" - no real fetch needed
  const products = allProducts;

  // Handler for adding a product to the cart (currently just logs to console)
  const handleAddToCart = (product) => console.log("Added to cart:", product);

  // Render the Collection page (only heading and cards in grid view)
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(ellipse_70%_40%_at_50%_20%,rgba(139,92,246,0.1)_0%,transparent_60%),radial-gradient(ellipse_50%_30%_at_20%_40%,rgba(168,85,247,0.08)_0%,transparent_50%),radial-gradient(ellipse_60%_35%_at_80%_30%,rgba(236,72,153,0.06)_0%,transparent_50%)] blur-[1px]"></div>
      <div className="container mx-auto px-5 max-w-6xl">
        {/* Header section with title (removed product count since no filters/pagination) */}
        <div className="flex justify-between items-end mb-12 relative z-10">
          <div className="header-content">
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2 text-white">
              All{" "}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg">
              Discover our complete collection of curated items
            </p>
          </div>
        </div>
        {/* Products grid (assuming grid view only, no list toggle) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {/* Render each product card */}
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800/50 border border-gray-700/30 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:bg-gray-800/80 hover:border-violet-500/50 hover:shadow-[0_25px_50px_rgba(139,92,246,0.15)]"
            >
              {/* Product image and overlay actions */}
              <div className="relative overflow-hidden bg-gray-700/30 h-75">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Show "New" or "Sale" badges if applicable */}
                {product.isNew && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-red-500 to-red-600 text-white">
                    Sale
                  </span>
                )}
                {/* Overlay with action buttons (Add to Cart, Quick View) */}
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(139,92,246,0.3)]"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button className="bg-transparent text-white border border-gray-600 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:border-violet-500 hover:text-violet-400">
                    Quick View
                  </button>
                </div>
              </div>
              {/* Product details */}
              <div className="p-6">
                <div className="text-violet-400 text-xs font-medium uppercase tracking-wider mb-2">
                  {product.category}
                </div>
                <h3 className="font-semibold text-white mb-2 leading-tight text-lg">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                {/* Product rating stars and review count */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill={
                            i < Math.floor(product.rating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                {/* Product price and original price if on sale */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-pink-500">
                    ${product.price}
                  </span>
                  {product.isSale && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;