/**
 * AddressesTab Component
 * 
 * Manages user shipping addresses with add, edit, delete,
 * and set default functionality. Includes empty state handling.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    selectUserAddresses,
    selectUserLoading,
} from '../../features/user/userSlice';
import AddressCard from './AddressCard';
import AddressFormModal from './AddressFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const AddressesTab = () => {
    const dispatch = useDispatch();
    const addresses = useSelector(selectUserAddresses);
    const loading = useSelector(selectUserLoading);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingAddressId, setDeletingAddressId] = useState(null);

    // Fetch addresses on mount
    useEffect(() => {
        dispatch(fetchUserAddresses());
    }, [dispatch]);

    /**
     * Opens add address modal
     */
    const handleAddAddress = useCallback(() => {
        setEditingAddress(null);
        setIsFormModalOpen(true);
    }, []);

    /**
     * Opens edit address modal
     */
    const handleEditAddress = useCallback((address) => {
        setEditingAddress(address);
        setIsFormModalOpen(true);
    }, []);

    /**
     * Opens delete confirmation modal
     */
    const handleDeleteClick = useCallback((addressId) => {
        setDeletingAddressId(addressId);
        setIsDeleteModalOpen(true);
    }, []);

    /**
     * Confirms address deletion
     */
    const handleConfirmDelete = useCallback(async () => {
        if (!deletingAddressId) return;

        try {
            await dispatch(deleteUserAddress(deletingAddressId)).unwrap();
            setIsDeleteModalOpen(false);
            setDeletingAddressId(null);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('AddressesTab: Failed to delete address', error);
            }
        }
    }, [dispatch, deletingAddressId]);

    /**
     * Handles form submission (add or edit)
     */
    const handleFormSubmit = useCallback(async (formData) => {
        try {
            if (editingAddress) {
                // Update existing address
                await dispatch(updateUserAddress({
                    addressId: editingAddress.id,
                    addressData: formData,
                })).unwrap();
            } else {
                // Add new address
                await dispatch(addUserAddress(formData)).unwrap();
            }
            setIsFormModalOpen(false);
            setEditingAddress(null);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('AddressesTab: Failed to save address', error);
            }
        }
    }, [dispatch, editingAddress]);

    /**
     * Sets an address as default
     */
    const handleSetDefault = useCallback(async (addressId) => {
        try {
            await dispatch(setDefaultAddress(addressId)).unwrap();
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('AddressesTab: Failed to set default address', error);
            }
        }
    }, [dispatch]);

    /**
     * Closes form modal
     */
    const handleCloseFormModal = useCallback(() => {
        setIsFormModalOpen(false);
        setEditingAddress(null);
    }, []);

    /**
     * Closes delete modal
     */
    const handleCloseDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setDeletingAddressId(null);
    }, []);

    // Empty state
    if (!loading && addresses.length === 0) {
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-200 mb-2">
                        No Addresses Saved
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Add your first shipping address to make checkout faster!
                    </p>

                    <button
                        type="button"
                        onClick={handleAddAddress}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Add first address"
                    >
                        Add Your First Address
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-200">
                    Saved Addresses ({addresses.length})
                </h3>
                <button
                    type="button"
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Add new address"
                >
                    + Add New Address
                </button>
            </div>

            {/* Loading State */}
            {loading && addresses.length === 0 && (
                <div className="bg-gray-800 rounded-lg shadow-md p-8">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={handleEditAddress}
                        onDelete={handleDeleteClick}
                        onSetDefault={handleSetDefault}
                        isLoading={loading}
                    />
                ))}
            </div>

            {/* Address Form Modal */}
            <AddressFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSubmit={handleFormSubmit}
                initialAddress={editingAddress}
                isLoading={loading}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Address?"
                message="Are you sure you want to delete this address? This action cannot be undone."
                confirmText="Delete Address"
                isLoading={loading}
            />
        </div>
    );
};

export default AddressesTab;
