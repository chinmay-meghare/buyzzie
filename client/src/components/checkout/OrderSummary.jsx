import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCartItems, 
  selectCartSubtotal, 
  selectCartLoading 
} from '../../features/cart/cartSlice';

/**
 * OrderSummary Component
 * 
 * Displays a comprehensive summary of cart items with:
 * - Item thumbnails, names, and quantities
 * - Calculated subtotal, shipping, tax, and total
 * - Sticky positioning on desktop for better UX
 * - Loading state with animated spinner
 * - Defensive programming for edge cases
 */
const OrderSummary = ({ 
  items: propItems, 
  subtotal: propSubtotal, 
  shipping: propShipping, 
  tax: propTax, 
  total: propTotal 
}) => {
  // Get cart data from Redux store as fallback if props not provided
  const reduxCartItems = useSelector(selectCartItems);
  const reduxSubtotal = useSelector(selectCartSubtotal);
  const isLoading = useSelector(selectCartLoading);

  // Use props if provided, otherwise fall back to Redux store
  // This provides flexibility and follows defensive programming practices
  const cartItems = propItems || reduxCartItems || [];
  const subtotal = propSubtotal !== undefined ? propSubtotal : reduxSubtotal || 0;

  // Calculate shipping cost: free shipping for orders over $50
  const shippingCost = useMemo(() => {
    if (propShipping !== undefined) {
      return parseFloat(propShipping) || 0;
    }
    return subtotal >= 50 ? 0 : 5.99;
  }, [propShipping, subtotal]);

  // Calculate tax: 8% of subtotal
  const taxAmount = useMemo(() => {
    if (propTax !== undefined) {
      return parseFloat(propTax) || 0;
    }
    return parseFloat((subtotal * 0.08).toFixed(2)) || 0;
  }, [propTax, subtotal]);

  // Calculate total: subtotal + shipping + tax
  const orderTotal = useMemo(() => {
    if (propTotal !== undefined) {
      return parseFloat(propTotal) || 0;
    }
    const calculatedTotal = parseFloat(subtotal) + parseFloat(shippingCost) + parseFloat(taxAmount);
    return parseFloat(calculatedTotal.toFixed(2)) || 0;
  }, [propTotal, subtotal, shippingCost, taxAmount]);

  // Calculate total item count for display
  const totalItemCount = useMemo(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((total, item) => {
      const quantity = item?.quantity || 0;
      return total + quantity;
    }, 0);
  }, [cartItems]);

  // Format currency for display
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '$0.00';
    }
    return `$${amount.toFixed(2)}`;
  };

  // Get product image URL with fallback
  const getProductImage = (item) => {
    if (!item) return null;
    
    // Handle different image formats
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    if (typeof item.image === 'string' && item.image) {
      return item.image;
    }
    
    // Return placeholder if no image available
    return null;
  };

  // Loading Spinner Component (Animated SVG)
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <svg
        className="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  // Handle empty cart state
  if (!isLoading && (!Array.isArray(cartItems) || cartItems.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <LoadingSpinner />
      </div>
    );
  }

  console.log('OrderSummary: Rendering with', cartItems.length, 'items');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Cart Items List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {cartItems.map((item) => {
          // Defensive checks for item data
          if (!item || !item.cartItemId) {
            console.warn('OrderSummary: Invalid item detected', item);
            return null;
          }

          const itemPrice = parseFloat(item.price) || 0;
          const itemQuantity = parseInt(item.quantity) || 0;
          const itemTotal = itemPrice * itemQuantity;
          const productImage = getProductImage(item);
          const productTitle = item.title || 'Unknown Product';
          const productSize = item.size || null;
          const productColor = item.color || null;

          return (
            <div
              key={item.cartItemId}
              className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
            >
              {/* Product Thumbnail */}
              <div className="flex-shrink-0">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={productTitle}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      // Fallback to placeholder on image load error
                      console.warn('OrderSummary: Image load failed for', productTitle);
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {productTitle}
                </h3>
                
                {/* Product Variations (Size/Color) */}
                {(productSize || productColor) && (
                  <div className="mt-1 text-xs text-gray-500">
                    {productSize && <span>Size: {productSize}</span>}
                    {productSize && productColor && <span className="mx-1">•</span>}
                    {productColor && <span>Color: {productColor}</span>}
                  </div>
                )}

                {/* Quantity and Price */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Qty: {itemQuantity}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(itemTotal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900 font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900 font-medium">
            {formatCurrency(taxAmount)}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(orderTotal)}
          </span>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {subtotal > 0 && subtotal < 50 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700">
            Add {formatCurrency(50 - subtotal)} more for free shipping!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;