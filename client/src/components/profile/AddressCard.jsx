/**
 * AddressCard Component
 * 
 * Displays a single address with edit/delete actions and default badge.
 * Includes hover effects and touch-friendly buttons.
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const AddressCard = ({
    address,
    onEdit,
    onDelete,
    onSetDefault,
    isLoading,
}) => {
    const handleEdit = useCallback(() => {
        onEdit(address);
    }, [address, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete(address.id);
    }, [address.id, onDelete]);

    const handleSetDefault = useCallback(() => {
        onSetDefault(address.id);
    }, [address.id, onSetDefault]);

    return (
        <div className={`bg-gray-800 rounded-lg shadow-md p-5 border-2 transition-all hover:shadow-lg ${address.isDefault ? 'border-blue-500' : 'border-gray-700'
            }`}>
            {/* Header with Default Badge */}
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-200">
                    {address.fullName ?? 'No Name'}
                </h4>
                {address.isDefault && (
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-900 text-blue-200 border border-blue-500 rounded-full">
                        DEFAULT
                    </span>
                )}
            </div>

            {/* Address Details */}
            <div className="space-y-1 text-sm text-gray-400 mb-4">
                <p>{address.phone ?? 'No phone'}</p>
                <p>{address.address ?? 'No street address'}</p>
                <p>
                    {address.city ?? 'No city'}, {address.state ?? 'No state'} {address.zipCode ?? ''}
                </p>
                <p>{address.country ?? 'No country'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                {!address.isDefault && (
                    <button
                        type="button"
                        onClick={handleSetDefault}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Set as default address"
                    >
                        Set Default
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Edit address"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Delete address"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

AddressCard.propTypes = {
    address: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zipCode: PropTypes.string,
        country: PropTypes.string,
        isDefault: PropTypes.bool,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSetDefault: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

AddressCard.defaultProps = {
    isLoading: false,
};

export default AddressCard;
