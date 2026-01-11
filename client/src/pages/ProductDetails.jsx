import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";
import { addToCart, selectCartError, clearError } from "../features/cart/cartSlice";
import { isUserAuthenticated } from "../features/cart/cartUtils";
import useScrollRestoration from "../hooks/useScrollRestoration";

const ProductDetails = () => {
  useScrollRestoration();
  const { productId: productIdStr } = useParams();
  const productId = parseInt(productIdStr, 10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector((state) => state.products);
  const cartError = useSelector(selectCartError);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    // Clear any previous cart errors
    dispatch(clearError());
  }, [dispatch, productId]);

  // Auto-select first size and color if available
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product, selectedSize, selectedColor]);

  // Show notification and clear it after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show cart error notification
  useEffect(() => {
    if (cartError) {
      setNotification({ type: 'error', message: cartError });
      dispatch(clearError());
    }
  }, [cartError, dispatch]);

  const handleAddToCart = async () => {
    try {
      // Check if user is authenticated
      if (!isUserAuthenticated()) {
        console.log('User not authenticated, redirecting to signup');
        navigate('/signup', { state: { from: `/product/${productId}` } });
        return;
      }

      // Validate product exists
      if (!product) {
        setNotification({ type: 'error', message: 'Product not available' });
        return;
      }

      // Validate stock availability
      if (product.stock < 1) {
        setNotification({ type: 'error', message: 'Product is out of stock' });
        return;
      }

      setAddToCartLoading(true);

      // Dispatch add to cart action
      dispatch(
        addToCart({
          product,
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
        })
      );

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Product added to cart successfully!',
      });

      console.log('Product added to cart:', {
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({
        type: 'error',
        message: 'Failed to add product to cart. Please try again.',
      });
    } finally {
      setAddToCartLoading(false);
    }
  };

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
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

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
              <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                Stock: {product.stock}
              </span>
              <span className="capitalize">{product.category.name}</span>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Select Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        selectedColor === color
                          ? "bg-indigo-600 border-indigo-400 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                <div className="flex space-x-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? "bg-indigo-600 border-indigo-400 text-white"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addToCartLoading || product.stock < 1}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                product.stock < 1
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : addToCartLoading
                  ? "bg-indigo-500 text-white cursor-wait"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {addToCartLoading
                ? "Adding to Cart..."
                : product.stock < 1
                ? "Out of Stock"
                : "Add to Cart"}
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