import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
            ⭐ {product.rating}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-90 mb-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-600">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500">{product.currency}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>Stock: {product.stock}</span>
          <span className="capitalize">{product.category.name}</span>
        </div>

        {product.colors.length > 0 && (
          <div className="mb-3">
            <span className="text-sm text-gray-90">Colors: </span>
            <div className="flex gap-1 mt-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-600 text-xs rounded"
                >
                  {color}
                </span>
              ))}
              {product.colors.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mb-3">
            <span className="text-sm text-gray-90">Sizes: </span>
            <div className="flex gap-1 mt-1">
              {product.sizes.map((size, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-600 text-xs rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
