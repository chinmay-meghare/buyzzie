/**
 * AddressFormModal Component
 * 
 * Modal for adding/editing addresses with validation matching ShippingForm.
 * Includes focus trap, animations, and comprehensive error handling.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Validates email format
 */
const validateEmail = (email) => {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Validates phone number (10 digits)
 */
const validatePhone = (phone) => {
    if (typeof phone !== 'string') return false;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
};

/**
 * Formats phone number as XXX-XXX-XXXX
 */
const formatPhoneNumber = (value) => {
    if (!value) return '';
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 6) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    }
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
};

/**
 * Validates a single field (matching ShippingForm logic)
 */
const validateField = (fieldName, value) => {
    const trimmedValue = typeof value === 'string' ? value.trim() : '';

    switch (fieldName) {
        case 'fullName':
            if (!trimmedValue) return 'Full name is required';
            if (trimmedValue.length < 2) return 'Name must be at least 2 characters';
            if (trimmedValue.length > 100) return 'Name must be less than 100 characters';
            return null;

        case 'email':
            if (!trimmedValue) return 'Email is required';
            if (!validateEmail(trimmedValue)) return 'Please enter a valid email address';
            return null;

        case 'phone':
            if (!trimmedValue) return 'Phone number is required';
            if (!validatePhone(trimmedValue)) return 'Phone number must be 10 digits';
            return null;

        case 'address':
            if (!trimmedValue) return 'Address is required';
            if (trimmedValue.length < 5) return 'Address must be at least 5 characters';
            return null;

        case 'city':
            if (!trimmedValue) return 'City is required';
            if (trimmedValue.length < 2) return 'City must be at least 2 characters';
            return null;

        case 'state':
            if (!trimmedValue) return 'State is required';
            if (trimmedValue.length < 2) return 'State must be at least 2 characters';
            return null;

        case 'zipCode':
            if (!trimmedValue) return 'ZIP code is required';
            const zipDigits = trimmedValue.replace(/\D/g, '');
            if (zipDigits.length < 5) return 'ZIP code must be at least 5 digits';
            if (zipDigits.length > 10) return 'ZIP code must be less than 10 digits';
            return null;

        default:
            return null;
    }
};

const AddressFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialAddress,
    isLoading,
}) => {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
    });
    const [errors, setErrors] = useState({});

    // Country options
    const countryOptions = useMemo(() => [
        { value: 'India', label: 'India' },
        { value: 'USA', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Australia', label: 'Australia' },
    ], []);

    // Initialize form data when modal opens or address changes
    useEffect(() => {
        if (isOpen && initialAddress) {
            setFormData({
                fullName: initialAddress.fullName ?? '',
                email: initialAddress.email ?? '',
                phone: initialAddress.phone ?? '',
                address: initialAddress.address ?? '',
                city: initialAddress.city ?? '',
                state: initialAddress.state ?? '',
                zipCode: initialAddress.zipCode ?? '',
                country: initialAddress.country ?? 'India',
            });
            setErrors({});
        } else if (isOpen && !initialAddress) {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
            });
            setErrors({});
        }
    }, [isOpen, initialAddress]);

    /**
     * Handle input change with phone formatting
     */
    const handleInputChange = useCallback((fieldName, value) => {
        if (fieldName === 'phone') {
            const formatted = formatPhoneNumber(value);
            setFormData((prev) => ({ ...prev, [fieldName]: formatted }));
        } else {
            setFormData((prev) => ({ ...prev, [fieldName]: value }));
        }

        // Clear error for this field
        setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }, []);

    /**
     * Handle field blur - validates on blur
     */
    const handleFieldBlur = useCallback((fieldName) => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
            setErrors((prev) => ({ ...prev, [fieldName]: error }));
        }
    }, [formData]);

    /**
     * Validate entire form
     */
    const validateForm = useCallback(() => {
        const newErrors = {};

        ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'].forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(formData);
    }, [formData, validateForm, onSubmit]);

    /**
     * Handle escape key
     */
    const handleEscapeKey = useCallback((event) => {
        if (event.key === 'Escape' && !isLoading) {
            onClose();
        }
    }, [isLoading, onClose]);

    /**
     * Handle backdrop click
     */
    const handleBackdropClick = useCallback((event) => {
        if (event.target === event.currentTarget && !isLoading) {
            onClose();
        }
    }, [isLoading, onClose]);

    /**
     * Focus management
     */
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement;
            modalRef.current?.focus();
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            previousFocusRef.current?.focus();
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscapeKey]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 overflow-y-auto"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 my-8"
                style={{
                    animation: 'scaleIn 0.2s ease-out',
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3
                        id="address-modal-title"
                        className="text-xl font-bold text-gray-200"
                    >
                        {initialAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            onBlur={() => handleFieldBlur('fullName')}
                            className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-600'
                                }`}
                            placeholder="John Doe"
                            maxLength={100}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onBlur={() => handleFieldBlur('email')}
                            className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-600'
                                }`}
                            placeholder="john.doe@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            onBlur={() => handleFieldBlur('phone')}
                            className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-600'
                                }`}
                            placeholder="123-456-7890"
                            maxLength={12}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{errors.phone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                            Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            onBlur={() => handleFieldBlur('address')}
                            className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.address ? 'border-red-500' : 'border-gray-600'
                                }`}
                            placeholder="123 Main Street, Apt 4B"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{errors.address}</p>
                        )}
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                onBlur={() => handleFieldBlur('city')}
                                className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.city ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Mumbai"
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-400" role="alert">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                onBlur={() => handleFieldBlur('state')}
                                className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.state ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Maharashtra"
                            />
                            {errors.state && (
                                <p className="mt-1 text-sm text-red-400" role="alert">{errors.state}</p>
                            )}
                        </div>
                    </div>

                    {/* ZIP and Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
                                ZIP Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="zipCode"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                onBlur={() => handleFieldBlur('zipCode')}
                                className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.zipCode ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="400001"
                                maxLength={10}
                            />
                            {errors.zipCode && (
                                <p className="mt-1 text-sm text-red-400" role="alert">{errors.zipCode}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                {countryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isLoading ? 'Saving...' : initialAddress ? 'Update Address' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

AddressFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialAddress: PropTypes.shape({
        fullName: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zipCode: PropTypes.string,
        country: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
};

AddressFormModal.defaultProps = {
    initialAddress: null,
    isLoading: false,
};

export default AddressFormModal;
