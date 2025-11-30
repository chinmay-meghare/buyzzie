import React, { useMemo, memo } from "react";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartLoading,
} from "../../features/cart/cartSlice";

const OrderSummary = ({
  overrideItems,
  overrideSubtotal,
  overrideShipping,
  overrideTax,
  overrideTotal,
}) => {
  const items = overrideItems ?? useSelector(selectCartItems) ?? [];
  const subtotal = overrideSubtotal ?? useSelector(selectCartSubtotal) ?? 0;
  const isLoading = useSelector(selectCartLoading);

  // Simple & Clear Calculations
  const shipping = overrideShipping ?? (subtotal >= 50 ? 0 : 5.99);
  const tax = overrideTax ?? Number((subtotal * 0.08).toFixed(2));
  const total = overrideTotal ?? Number((subtotal + shipping + tax).toFixed(2));

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  }, [items]);

  const format = (amount) => `$${(Number(amount) || 0).toFixed(2)}`;

  const getImage = (item) => {
    return item?.images?.[0] || item?.image || null;
  };

  // Empty Cart
  if (!isLoading && items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="text-center py-8 text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-300">Order Summary</h2>
        <p className="text-sm text-gray-300 mt-1">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => {
          if (!item?.cartItemId) return null;

          const price = Number(item.price) || 0;
          const qty = Number(item.quantity) || 1;
          const itemTotal = price * qty;
          const img = getImage(item);

          return (
            <div
              key={item.cartItemId}
              className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-shrink-0">
                {img ? (
                  <img
                    src={img}
                    alt={item.title || "Product"}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-300">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium truncate">
                  {item.title || "Unknown Product"}
                </h3>
                {(item.size || item.color) && (
                  <p className="text-xs text-gray-300 mt-1">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && " • "}
                    {item.color && `Color: ${item.color}`}
                  </p>
                )}
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-gray-300">Qty: {qty}</span>
                  <span className="text-sm font-medium">
                    {format(itemTotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Subtotal</span>
          <span className="font-medium">{format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              format(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Tax</span>
          <span className="font-medium">{format(tax)}</span>
        </div>

        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold">Total</span>
          <span className="text-lg font-bold" aria-live="polite">
            {format(total)}
          </span>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {subtotal > 0 && subtotal < 50 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
          Add {format(50 - subtotal)} more for free shipping!
        </div>
      )}
    </div>
  );
};

export default memo(OrderSummary);