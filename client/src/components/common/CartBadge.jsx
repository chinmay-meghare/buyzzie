import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../../features/cart/cartSlice';

/**
 * CartBadge Component
 * 
 * Displays the total number of items in the cart as a badge.
 * Features:
 * - Fetches cart item count from Redux state
 * - Only displays when cart has items (count > 0)
 * - Positioned in the top-right corner of parent
 * - Includes fallback for undefined/null values
 * 
 * @returns {JSX.Element|null} Badge element or null if cart is empty
 */
const CartBadge = () => {
    // Fetch cart item count from Redux state with fallback
    const itemCount = useSelector(selectCartItemCount) || 0;

    // Don't render badge if cart is empty
    if (itemCount === 0) {
        return null;
    }

    // Ensure itemCount is a valid number
    const displayCount = Number.isFinite(itemCount) ? itemCount : 0;

    // Don't render if displayCount is still 0 after validation
    if (displayCount === 0) {
        return null;
    }

    return (
        <span
            className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full border-2 border-white shadow-lg"
            aria-label={`${displayCount} item${displayCount !== 1 ? 's' : ''} in cart`}
            role="status"
        >
            {displayCount > 99 ? '99+' : displayCount}
        </span>
    );
};

export default CartBadge;
