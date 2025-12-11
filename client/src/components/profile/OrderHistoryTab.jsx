/**
 * OrderHistoryTab Component
 * 
 * Displays order statistics and recent order history with
 * links to detailed order pages. Includes empty state handling.
 */

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fetchOrders,
    selectOrders,
    selectOrdersLoading,
} from '../../features/orders/orderSlice';

/**
 * Formats currency
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount ?? 0);
};

/**
 * Formats date
 */
const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return 'N/A';
    }
};

/**
 * Gets status badge color
 */
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-900 text-yellow-200 border-yellow-500';
        case 'processing':
            return 'bg-blue-900 text-blue-200 border-blue-500';
        case 'shipped':
            return 'bg-purple-900 text-purple-200 border-purple-500';
        case 'delivered':
            return 'bg-green-900 text-green-200 border-green-500';
        case 'cancelled':
            return 'bg-red-900 text-red-200 border-red-500';
        default:
            return 'bg-gray-700 text-gray-200 border-gray-500';
    }
};

/**
 * Get product image with fallback
 */
const getProductImage = (item) => {
    return item?.images?.[0] ?? item?.image ?? null;
};

const OrderHistoryTab = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const loading = useSelector(selectOrdersLoading);

    // Fetch orders on mount
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);



    /**
     * Get recent orders (last 5)
     */
    const recentOrders = useMemo(() => {
        return orders.slice(0, 5);
    }, [orders]);

    // Loading state
    if (loading && orders.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-md p-8">
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!loading && orders.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-md p-8">
                <div className="text-center">
                    {/* Empty State Icon */}
                    <div className="flex justify-center mb-4">
                        <svg
                            className="w-24 h-24 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-200 mb-2">
                        No Orders Yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Start shopping to see your order history here!
                    </p>

                    <Link
                        to="/collection"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Recent Orders Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-200">
                        Recent Orders
                    </h3>
                    {orders.length > 5 && (
                        <Link
                            to="/orders"
                            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            View All Orders →
                        </Link>
                    )}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="text-sm font-mono text-gray-300">
                                            #{order.id}
                                        </p>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                                            {order.status?.toUpperCase() ?? 'UNKNOWN'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                                        <span>{formatDate(order.createdAt)}</span>
                                        <span>•</span>
                                        <span>{order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                        <span>•</span>
                                        <span className="font-semibold text-gray-200">{formatCurrency(order.total)}</span>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <Link
                                    to={`/order-confirmation/${order.id}`}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-center"
                                >
                                    View Details
                                </Link>
                            </div>

                            {/* Product Thumbnails List */}
                            {order.items && order.items.length > 0 && (
                                <div className="border-t border-gray-600 pt-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {order.items.map((item, index) => {
                                            const itemImage = getProductImage(item);

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 bg-gray-800 rounded-md p-2"
                                                >
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        {itemImage ? (
                                                            <img
                                                                src={itemImage}
                                                                alt={item.title ?? item.name ?? 'Product'}
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
                                                        <p className="text-sm text-gray-200 font-medium truncate">
                                                            {item.title ?? item.name ?? 'Product'}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <span>Qty: {item.quantity || 1}</span>
                                                            <span>•</span>
                                                            <span className="text-gray-300 font-semibold">
                                                                {formatCurrency(item.price * (item.quantity || 1))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* View All Button (mobile) */}
                {orders.length > 5 && (
                    <div className="mt-6 sm:hidden">
                        <Link
                            to="/orders"
                            className="block w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors text-center"
                        >
                            View All Orders
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryTab;
