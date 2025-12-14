/**
 * CustomerTable.jsx
 * 
 * View-only table component to display registered customers.
 * Follows Rule 14 (Visual Feedback) with role badges and Rule 19 (A11y).
 */
import React from 'react';
import PropTypes from 'prop-types';

const CustomerTable = ({ customers }) => {
    // Rule 2: Meaningful Naming
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'Invalid Date';
        }
    };

    // Rule 14: Visual Feedback - Empty State
    if (!customers || customers.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-700">
                <div className="flex justify-center mb-4">
                    <svg className="h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300">No customers found</h3>
                <p className="mt-1 text-sm text-gray-500">There are no registered customers matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap" aria-label="Customers Table">
                    <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User Info</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {customers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {/* Rule 10: Defensive Programming with optional chaining */}
                                        <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold text-sm shrink-0">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-200">{user.name || 'Unknown User'}</div>
                                            <div className="text-xs text-gray-500 font-mono">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-900 text-purple-200 border border-purple-700'
                                            : 'bg-green-900 text-green-200 border border-green-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {user.phone || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Rule 13: Smart Validation using PropTypes
CustomerTable.propTypes = {
    customers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        createdAt: PropTypes.string,
        phone: PropTypes.string,
    })).isRequired,
};

export default CustomerTable;
