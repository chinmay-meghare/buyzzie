import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";

const ProductDetails = () => {
  const { productId: productIdStr } = useParams();
  const productId = parseInt(productIdStr, 10);
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full rounded-lg mb-4"
            />
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className={`w-full rounded-lg cursor-pointer ${
                    selectedImage === index ? "border-2 border-indigo-500" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.445a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.445a1 1 0 00-1.175 0l-3.365 2.445c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.35 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
                <span className="text-gray-400 ml-2">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold mb-4">${product.price}</p>
            <p className="text-gray-400 mb-6">{product.description}</p>

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

            <div>
              <h3 className="text-lg font-semibold mb-2">Select Size</h3>
              <div className="flex space-x-2 mb-6">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="w-12 h-12 border border-gray-600 rounded-lg hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              Add to Cart
            </button>
            <div className="mt-6 text-sm text-gray-400">
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
