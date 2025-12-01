/**
 * OrderConfirmation.jsx
 *
 * Production-level order confirmation page with:
 * - Redux-first data retrieval with fallback fetch
 * - Animated success checkmark
 * - Mobile-responsive collapsible order summary
 * - Complete order details display
 * - Error handling for 404 and fetch failures
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
  fetchOrderById,
  clearError,
} from "../features/orders/orderSlice";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  // Mobile collapsible state (default collapsed on mobile)
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(false);
  const [checkmarkAnimated, setCheckmarkAnimated] = useState(false);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Trigger checkmark animation on mount
  useEffect(() => {
    if (currentOrder) {
      // Add a small delay to ensure the user sees the animation start
      const timer = setTimeout(() => {
        setCheckmarkAnimated(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentOrder]);

  // Fetch order if not in Redux and orderId exists
  useEffect(() => {
    if (!orderId) {
      if (process.env.NODE_ENV === "development") {
        console.warn("OrderConfirmation: Missing orderId in URL params");
      }
      navigate("/");
      return;
    }

    // Check if current order matches the orderId from URL
    const orderMatches = currentOrder?.id === orderId;

    if (!currentOrder || !orderMatches) {
      if (!loading) {
        if (process.env.NODE_ENV === "development") {
          console.log("OrderConfirmation: Fetching order from API", {
            orderId,
            currentOrderId: currentOrder?.id,
          });
        }
        dispatch(fetchOrderById(orderId));
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("OrderConfirmation: Using order from Redux state", {
          orderId,
        });
      }
    }
  }, [orderId, currentOrder, loading, dispatch, navigate]);

  // Format currency helper
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `$${num.toFixed(2)}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get estimated delivery date (7 days from order date)
  const getEstimatedDelivery = (orderDate) => {
    if (!orderDate) return "N/A";
    try {
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      return formatDate(deliveryDate.toISOString());
    } catch (error) {
      return "N/A";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get payment method display name
  const getPaymentMethodDisplay = (method) => {
    switch (method?.toUpperCase()) {
      case "COD":
        return "Cash on Delivery";
      case "CARD":
        return "Credit / Debit Card";
      case "UPI":
        return "UPI";
      default:
        return method ?? "N/A";
    }
  };

  // Get product image with fallback
  const getProductImage = (item) => {
    return item?.images?.[0] ?? item?.image ?? null;
  };

  // Loading skeleton
  if (loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (404 or fetch failure)
  if (error || (!loading && !currentOrder && orderId)) {
    const isNotFound = error?.includes("not found") || error?.includes("404");

    return (
      <div className="min-h-screen bg-gray-900 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            {/* 404 Icon */}
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-200 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              {isNotFound
                ? "This order doesn't exist or you don't have permission to view it."
                : "Failed to load order details. Please try again later."}
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              aria-label="Return to home page"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No order data
  if (!currentOrder) {
    return null;
  }

  const {
    id,
    createdAt,
    status,
    items = [],
    shippingAddress = {},
    paymentMethod,
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
    estimatedDelivery,
  } = currentOrder;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation Card */}
        <div
          className="bg-white rounded-lg shadow-md p-6 mb-6 transform transition-all duration-300"
          style={{
            animation: checkmarkAnimated ? "fadeInScale 0.4s ease-out" : "none",
          }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Animated Checkmark */}
            <div className="mb-4 relative">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 100,
                    strokeDashoffset: checkmarkAnimated ? 0 : 100,
                    transition: "stroke-dashoffset 1s ease-in-out",
                  }}
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. We've received your order and will
              send you a confirmation email shortly.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Order ID & Date */}
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-4">
                Order Information
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-gray-200 font-mono">{id ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date:</span>
                  <span className="text-gray-200">{formatDate(createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      status
                    )}`}
                  >
                    {status ?? "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery & Payment */}
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-4">
                Delivery & Payment
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Delivery:</span>
                  <span className="text-gray-200">
                    {estimatedDelivery
                      ? formatDate(estimatedDelivery)
                      : getEstimatedDelivery(createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-gray-200">
                    {getPaymentMethodDisplay(paymentMethod)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Shipping Address */}I
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">
              Shipping Address
            </h2>
            <div className="text-sm text-gray-300 space-y-1">
              <p className="font-medium">{shippingAddress.fullName ?? "N/A"}</p>
              <p>{shippingAddress.address ?? ""}</p>
              <p>
                {[
                  shippingAddress.city,
                  shippingAddress.state,
                  shippingAddress.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {shippingAddress.country && <p>{shippingAddress.country}</p>}
              {shippingAddress.phone && (
                <p className="mt-2 text-gray-400">
                  Phone: {shippingAddress.phone}
                </p>
              )}
              {shippingAddress.email && (
                <p className="text-gray-400">Email: {shippingAddress.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items - Collapsible on Mobile */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Order Items</h2>
            {/* Mobile Collapse Toggle */}
            <button
              onClick={() => setIsOrderSummaryExpanded(!isOrderSummaryExpanded)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-200 transition-colors"
              aria-expanded={isOrderSummaryExpanded}
              aria-label={
                isOrderSummaryExpanded
                  ? "Collapse order summary"
                  : "Expand order summary"
              }
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isOrderSummaryExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Order Items List - Hidden on mobile when collapsed */}
          <div
            className={`space-y-4 ${
              isOrderSummaryExpanded ? "block" : "hidden"
            } md:block`}
            aria-hidden={!isOrderSummaryExpanded}
          >
            {items.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No items found in this order.
              </p>
            ) : (
              items.map((item, index) => {
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 1;
                const itemTotal = itemPrice * itemQuantity;
                const itemImage = getProductImage(item);

                return (
                  <div
                    key={item.cartItemId ?? item.id ?? index}
                    className="flex gap-4 pb-4 border-b border-gray-700 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={item.title ?? "Product"}
                          className="w-20 h-20 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-200 truncate">
                        {item.title ?? "Unknown Product"}
                      </h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-400 mt-1">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " • "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Quantity: {itemQuantity}
                        </span>
                        <span className="text-sm font-semibold text-gray-200">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Totals */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="text-gray-200 font-medium">
                {shipping === 0 ? (
                  <span className="text-green-400">Free</span>
                ) : (
                  formatCurrency(shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(tax)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-700">
              <span className="text-base font-semibold text-gray-200">
                Grand Total
              </span>
              <span
                className="text-lg font-bold text-gray-100"
                aria-live="polite"
              >
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/collection")}
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors min-h-[44px]"
            aria-label="Continue shopping"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors min-h-[44px]"
            aria-label="View all orders"
          >
            View Orders
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

OrderConfirmation.propTypes = {};

export default OrderConfirmation;
