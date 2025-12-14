/**
 * ProductList.jsx
 * 
 * Page component for listing, filtering, and managing products.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import api from '../../services/axios';
import { toast } from 'react-toastify';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Delete modal state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/products');
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            toast.error('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await api.delete(`/api/admin/products/${productToDelete.id}`);
            // Remove from local state
            setProducts(products.filter(p => p.id !== productToDelete.id));
            setIsDeleteOpen(false);
            setProductToDelete(null);
            toast.success('Product deleted successfully');
        } catch (err) {
            console.error('Failed to delete product', err);
            toast.error('Failed to delete product');
        }
    };

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const productCategory = typeof product.category === 'object' ? product.category.name : product.category;
        const matchesCategory = categoryFilter === '' || productCategory === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = ['Clothes', 'Electronics', 'Furniture', 'Shoes', 'Miscellaneous'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-200">Products</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:bg-gray-900 focus:border-blue-500 sm:text-sm"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="sm:w-48">
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-900 bg-opacity-50 text-red-200 p-4 rounded-md border border-red-700">
                    {error}
                </div>
            ) : (
                <>
                    <ProductTable products={currentProducts} onDelete={handleDeleteClick} />

                    {/* Pagination */}
                    {filteredProducts.length > itemsPerPage && (
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
                                        Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium text-white">{filteredProducts.length}</span> results
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
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {/* Simple pagination logic showing current page context */}
                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-800 text-sm font-medium text-white">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isDangerous={true}
            />
        </div>
    );
};

export default ProductList;
