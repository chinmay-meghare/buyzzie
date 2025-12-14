/**
 * CustomerList.jsx
 * 
 * Admin page for managing/viewing registered customers.
 * Follows Rule 12 (Loading States), Rule 6 (Robust Error Handling), and simple pagination.
 */
import React, { useState, useEffect } from 'react';
import CustomerTable from '../../components/admin/CustomerTable';
import api from '../../services/axios';
import { toast } from 'react-toastify';

const CustomerList = () => {
    // Rule 2: Meaningful Naming
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Rule 4: KISS - Effects for data fetching
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const response = await api.get('/api/admin/users');
            setCustomers(response.data);
        } catch (err) {
            // Rule 6: Robust Error Handling
            const displayedError = err.response?.data?.error || 'Failed to load customers.';
            setErrorMessage(displayedError);
            toast.error(displayedError); // Toast notification

            if (process.env.NODE_ENV === 'development') {
                console.error('Customer fetch error:', err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Rule 4: KISS - Simple client-side pagination since dataset is small for Phase 4
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const currentCustomers = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-200">Customers</h1>
                <button
                    onClick={fetchCustomers}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Refresh customer list"
                >
                    {/* Rule 12: Loading Spinner or Icon */}
                    <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh List
                </button>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center py-20" aria-label="Loading customers">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : errorMessage ? (
                // Rule 14: Visual Feedback for Error
                <div className="bg-red-900 bg-opacity-20 text-red-200 p-6 rounded-lg border border-red-800 text-center">
                    <svg className="w-12 h-12 mx-auto text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-lg font-medium">{errorMessage}</p>
                    <button
                        onClick={fetchCustomers}
                        className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <CustomerTable customers={currentCustomers} />

                    {/* Pagination Controls */}
                    {customers.length > itemsPerPage && (
                        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, customers.length)}</span> of <span className="font-medium text-white">{customers.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-800 text-sm font-medium text-white">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CustomerList;
