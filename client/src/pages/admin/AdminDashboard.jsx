/**
 * AdminDashboard.jsx
 * 
 * Main dashboard page for admin panel.
 * Displays key metrics: total products, orders, revenue, recent orders, and low stock alerts.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/admin/StatsCard';
import api from '../../services/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/admin/stats');
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to load dashboard stats');
            if (process.env.NODE_ENV === 'development') {
                console.error('AdminDashboard: Failed to fetch stats', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

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

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-200">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-200">Dashboard</h1>
                <div className="bg-red-900 border border-red-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-lg font-semibold text-red-200">Error Loading Dashboard</h2>
                    </div>
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-200">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome to Buyzzie Admin Panel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Products"
                    value={stats?.totalProducts || 0}
                    color="blue"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    color="purple"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    color="green"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatsCard
                    title="Low Stock Items"
                    value={stats?.lowStockCount || 0}
                    color={stats?.lowStockCount > 0 ? 'red' : 'green'}
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-200">Recent Orders</h2>
                    <Link
                        to="/admin/orders"
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        View All →
                    </Link>
                </div>

                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-300 font-mono">#{order.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-300">{order.customerName || 'N/A'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-900 text-green-200' :
                                                    order.status === 'shipped' ? 'bg-purple-900 text-purple-200' :
                                                        order.status === 'processing' ? 'bg-blue-900 text-blue-200' :
                                                            'bg-yellow-900 text-yellow-200'
                                                }`}>
                                                {order.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-200 font-semibold text-right">
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-gray-400">No recent orders</p>
                    </div>
                )}
            </div>

            {/* Low Stock Alert */}
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
                <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-red-200">Low Stock Alert</h2>
                    </div>
                    <div className="space-y-2">
                        {stats.lowStockProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between py-2 px-4 bg-gray-800 rounded-md">
                                <div className="flex items-center gap-3">
                                    {product.images?.[0] && (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    )}
                                    <span className="text-gray-200">{product.title}</span>
                                </div>
                                <span className="text-red-400 font-semibold">Stock: {product.stock}</span>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/admin/products"
                        className="mt-4 inline-block px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
                    >
                        Manage Products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
