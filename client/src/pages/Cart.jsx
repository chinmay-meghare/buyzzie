import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartItemCount,
  selectIsCartEmpty,
  initializeCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import { isUserAuthenticated } from "../features/cart/cartUtils";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const isCartEmpty = useSelector(selectIsCartEmpty);
  const isAuthenticated = isUserAuthenticated();

  // Initialize cart from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(initializeCart());
      console.log("Cart page: Cart initialized");
    }
  }, [dispatch, isAuthenticated]);

  const handleIncrementQuantity = (cartItemId) => {
    dispatch(incrementQuantity(cartItemId));
  };

  const handleDecrementQuantity = (cartItemId) => {
    dispatch(decrementQuantity(cartItemId));
  };

  const handleRemoveItem = (cartItemId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      dispatch(clearCart());
    }
  };

  // If user is not authenticated, show empty cart message with signup button
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Cart is empty!</h2>
          <p className="text-gray-400 mb-6">Add some products to your cart</p>
          <Link
            to="/signup"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Sign Up to Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty (but user is authenticated)
  if (isCartEmpty) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty!</h2>
          <p className="text-gray-400 mb-6">
            Start shopping to add items to your cart
          </p>
          <Link
            to="/collection"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/150"}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {item.title}
                      </h3>
                      {(item.size || item.color) && (
                        <p className="text-sm text-gray-400">
                          {[item.size, item.color].filter(Boolean).join(" / ")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.cartItemId)}
                      className="text-red-400 hover:text-red-300 text-xl"
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleDecrementQuantity(item.cartItemId)
                          }
                          className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleIncrementQuantity(item.cartItemId)
                          }
                          className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                          disabled={item.quantity >= item.stock}
                          title={
                            item.quantity >= item.stock
                              ? `Only ${item.stock} available in stock`
                              : "Increase quantity"
                          }
                        >
                          +
                        </button>
                      </div>
                      {item.quantity >= item.stock && (
                        <span className="text-xs text-yellow-400">
                          (Max: {item.stock})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        ${item.price} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Items ({cartItemCount})</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/collection"
                className="block text-center text-indigo-400 hover:text-indigo-300 underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
