import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../features/cart/cartSlice";
import { isUserAuthenticated } from "../../features/cart/cartUtils";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);


  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Check if user is authenticated
      if (!isUserAuthenticated()) {
        console.log('User not authenticated, redirecting to signup');
        navigate('/signup', { state: { from: `/product/${product.id}` } });
        return;
      }

      // Validate product exists and has stock
      if (!product) {
        toast.error('Product not available');
        return;
      }


      if (product.stock < 1) {
        toast.error('Product is out of stock');
        return;
      }

      setIsAdding(true);

      // Dispatch add to cart action
      dispatch(
        addToCart({
          product,
          size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null,
          color: product.colors && product.colors.length > 0 ? product.colors[0] : null,
          quantity: 1,
        })
      );

      toast.success('Product added to cart');

      console.log('Product added to cart from card:', product.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>


      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link to={`/product/${product.id}`}>
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ {product.rating}
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-100 mb-2 hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-green-600">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">{product.currency}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock < 1}
            className={`w-full py-2 px-4 rounded-md transition-colors ${product.stock < 1
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : isAdding
                ? "bg-blue-500 text-white cursor-wait"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {isAdding ? "Adding..." : product.stock < 1 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;