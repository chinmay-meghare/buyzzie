/**
 * ProductForm.jsx
 * 
 * Form component for adding and editing products.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/axios';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Clothes',
        stock: '',
        image1: '',
        image2: '',
        image3: '',
        sizes: [],
        colors: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState(null);

    const categories = ['Clothes', 'Electronics', 'Furniture', 'Shoes', 'Miscellaneous'];
    const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setFetching(true);
            const response = await api.get(`/api/admin/products/${id}`);
            const product = response.data;

            // Map properties to form state
            setFormData({
                title: product.title || '',
                description: product.description || '',
                price: product.price || '',
                category: typeof product.category === 'object' ? product.category.name : product.category,
                stock: product.stock || '',
                image1: product.images?.[0] || '',
                image2: product.images?.[1] || '',
                image3: product.images?.[2] || '',
                sizes: product.sizes || [],
                colors: product.colors ? product.colors.join(', ') : ''
            });
        } catch (err) {
            setError('Failed to fetch product details.');
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeChange = (size) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Prepare payload
        const images = [formData.image1, formData.image2, formData.image3].filter(Boolean);
        const colors = formData.colors.split(',').map(c => c.trim()).filter(Boolean);

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            images,
            colors
        };

        // Cleanup temp fields
        delete payload.image1;
        delete payload.image2;
        delete payload.image3;

        try {
            if (isEditMode) {
                await api.put(`/api/admin/products/${id}`, payload);
            } else {
                await api.post('/api/admin/products', payload);
            }
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-200">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="text-gray-400 hover:text-white"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="bg-red-900 bg-opacity-50 text-red-200 p-4 rounded-md border border-red-700 mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select
                            name="category"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Colors (comma separated)</label>
                        <input
                            type="text"
                            name="colors"
                            placeholder="e.g. Red, Blue, Black"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.colors}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Available Sizes</label>
                    <div className="flex flex-wrap gap-4">
                        {availableSizes.map(size => (
                            <label key={size} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
                                    checked={formData.sizes.includes(size)}
                                    onChange={() => handleSizeChange(size)}
                                />
                                <span className="ml-2 text-gray-300">{size}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">Product Images (URLs)</label>
                    <input
                        type="text"
                        name="image1"
                        placeholder="Image URL 1 (Main)"
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.image1}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="image2"
                        placeholder="Image URL 2 (Optional)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.image2}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="image3"
                        placeholder="Image URL 3 (Optional)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.image3}
                        onChange={handleChange}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isEditMode ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
