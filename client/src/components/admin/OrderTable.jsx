/**
 * OrderTable.jsx
 * 
 * Component to display list of orders with status management.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OrderStatusDropdown from './OrderStatusDropdown';

const OrderTable = ({ orders, onStatusChange }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-700">
                <p className="text-gray-400">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                    <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-750 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-200">{order.customerName || 'Guest'}</span>
                                        <span className="text-xs text-gray-500">{order.customerEmail}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-200">
                                    {formatCurrency(order.total)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <OrderStatusDropdown
                                        orderId={order.id}
                                        currentStatus={order.status || 'pending'}
                                        onStatusChange={onStatusChange}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        to={`/order-confirmation/${order.id}`}
                                        className="text-blue-400 hover:text-blue-300"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

OrderTable.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        customerName: PropTypes.string,
        customerEmail: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
        status: PropTypes.string,
    })).isRequired,
    onStatusChange: PropTypes.func,
};

export default OrderTable;
