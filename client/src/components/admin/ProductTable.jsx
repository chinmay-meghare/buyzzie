/**
 * ProductTable.jsx
 * 
 * Table component to display list of products with actions.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductTable = ({ products, onDelete }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (!products || products.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-700">
                <p className="text-gray-400">No products found.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                    <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-750 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-md object-cover border border-gray-600"
                                                src={product.images?.[0] || 'https://via.placeholder.com/40'}
                                                alt={product.title}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-200 truncate max-w-xs" title={product.title}>
                                                {product.title}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                                        {product.category?.name || product.category || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`font-medium ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            to={`/admin/products/${product.id}/edit`}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => onDelete(product)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ProductTable.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        category: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({ name: PropTypes.string })
        ]),
        images: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ProductTable;
