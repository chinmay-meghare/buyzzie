/**
 * OrderStatusDropdown.jsx
 * 
 * Component to update order status with visual feedback.
 * Uses optimistic UI updates for better user experience.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/axios';

const OrderStatusDropdown = ({ orderId, currentStatus, onStatusChange }) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-yellow-900 text-yellow-200' },
        { value: 'processing', label: 'Processing', color: 'bg-blue-900 text-blue-200' },
        { value: 'shipped', label: 'Shipped', color: 'bg-purple-900 text-purple-200' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-900 text-green-200' },
    ];

    const handleChange = async (e) => {
        const newStatus = e.target.value;
        if (newStatus === status) return;

        // Optimistic update
        const oldStatus = status;
        setStatus(newStatus);
        setLoading(true);

        try {
            await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            if (onStatusChange) {
                onStatusChange(orderId, newStatus);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            // Revert on failure
            setStatus(oldStatus);
            alert('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const currentOption = statusOptions.find(opt => opt.value === status) || statusOptions[0];

    return (
        <div className="relative inline-block text-center">
            <select
                value={status}
                onChange={handleChange}
                disabled={loading}
                className={`block w-full px-1 sm:px-2 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-full border-0 overflow-hidden truncate focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 cursor-pointer transition-colors ${currentOption.color} appearance-none`}
                aria-label={`Change status for order ${orderId}`}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-gray-200">
                        {option.label}
                    </option>
                ))}
            </select>
            {loading && (
                <div className="absolute right-2 top-1.5 pointer-events-none">
                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
        </div>
    );
};

OrderStatusDropdown.propTypes = {
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currentStatus: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func,
};

export default OrderStatusDropdown;
