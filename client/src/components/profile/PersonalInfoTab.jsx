/**
 * PersonalInfoTab Component
 * 
 * Displays and allows editing of user personal information including
 * name, email, phone, and profile picture with real-time validation.
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, selectUserLoading } from '../../features/user/userSlice';
import ProfilePictureUpload from './ProfilePictureUpload';

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
    if (!phone) return true; // Phone is optional
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
 * Validates a single field
 */
const validateField = (fieldName, value) => {
    const trimmedValue = typeof value === 'string' ? value.trim() : '';

    switch (fieldName) {
        case 'name':
            if (!trimmedValue) return 'Name is required';
            if (trimmedValue.length < 2) return 'Name must be at least 2 characters';
            if (trimmedValue.length > 100) return 'Name must be less than 100 characters';
            return null;

        case 'email':
            if (!trimmedValue) return 'Email is required';
            if (!validateEmail(trimmedValue)) return 'Please enter a valid email address';
            return null;

        case 'phone':
            if (trimmedValue && !validatePhone(trimmedValue)) {
                return 'Phone number must be 10 digits';
            }
            return null;

        default:
            return null;
    }
};

const PersonalInfoTab = ({ user }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectUserLoading);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        profilePicture: user?.profilePicture ?? null,
    });
    const [errors, setErrors] = useState({});

    // Update form data when user prop changes
    useEffect(() => {
        setFormData({
            name: user?.name ?? '',
            email: user?.email ?? '',
            phone: user?.phone ?? '',
            profilePicture: user?.profilePicture ?? null,
        });
    }, [user]);

    /**
     * Handles input change with formatting for phone
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
     * Handles field blur - validates on blur
     */
    const handleFieldBlur = useCallback((fieldName) => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
            setErrors((prev) => ({ ...prev, [fieldName]: error }));
        }
    }, [formData]);

    /**
     * Handles profile picture change
     */
    const handlePictureChange = useCallback((base64Picture) => {
        setFormData((prev) => ({ ...prev, profilePicture: base64Picture }));
    }, []);

    /**
     * Validates entire form
     */
    const validateForm = useCallback(() => {
        const newErrors = {};

        ['name', 'email', 'phone'].forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    /**
     * Handles form submission
     */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            setIsEditing(false);
            // Refresh the page to show updated information
            window.location.reload();
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('PersonalInfoTab: Failed to update profile', error);
            }
        }
    }, [dispatch, formData, validateForm]);

    /**
     * Toggles edit mode
     */
    const handleEditToggle = useCallback(() => {
        if (isEditing) {
            // Cancel editing - reset form
            setFormData({
                name: user?.name ?? '',
                email: user?.email ?? '',
                phone: user?.phone ?? '',
                profilePicture: user?.profilePicture ?? null,
            });
            setErrors({});
        }
        setIsEditing(!isEditing);
    }, [isEditing, user]);

    // Format account creation date
    const formattedCreatedAt = useMemo(() => {
        if (!user?.createdAt) return 'N/A';
        try {
            return new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    }, [user?.createdAt]);

    return (
        <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Profile Picture</h3>
                <ProfilePictureUpload
                    currentPicture={isEditing ? formData.profilePicture : user?.profilePicture}
                    onPictureChange={handlePictureChange}
                />
            </div>

            {/* Personal Information Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-200">Personal Information</h3>
                    <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    onBlur={() => handleFieldBlur('name')}
                                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                    placeholder="John Doe"
                                    aria-label="Full name"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                    maxLength={100}
                                />
                                {errors.name && (
                                    <p
                                        id="name-error"
                                        className="mt-1 text-sm text-red-400"
                                        role="alert"
                                        aria-live="polite"
                                    >
                                        {errors.name}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-200 py-2">{user?.name ?? 'N/A'}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                            <>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onBlur={() => handleFieldBlur('email')}
                                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                    placeholder="john.doe@example.com"
                                    aria-label="Email address"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                {errors.email && (
                                    <p
                                        id="email-error"
                                        className="mt-1 text-sm text-red-400"
                                        role="alert"
                                        aria-live="polite"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-200 py-2">{user?.email ?? 'N/A'}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Phone Number
                        </label>
                        {isEditing ? (
                            <>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    onBlur={() => handleFieldBlur('phone')}
                                    className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                    placeholder="123-456-7890"
                                    aria-label="Phone number"
                                    aria-invalid={!!errors.phone}
                                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                                    maxLength={12}
                                />
                                {errors.phone && (
                                    <p
                                        id="phone-error"
                                        className="mt-1 text-sm text-red-400"
                                        role="alert"
                                        aria-live="polite"
                                    >
                                        {errors.phone}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-200 py-2">{user?.phone || 'Not provided'}</p>
                        )}
                    </div>

                    {/* Role Badge */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Account Role
                        </label>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${user?.role === 'admin'
                            ? 'bg-purple-900 text-purple-200 border border-purple-500'
                            : 'bg-blue-900 text-blue-200 border border-blue-500'
                            }`}>
                            {user?.role?.toUpperCase() ?? 'USER'}
                        </span>
                    </div>

                    {/* Account Created Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Member Since
                        </label>
                        <p className="text-gray-200 py-2">{formattedCreatedAt}</p>
                    </div>

                    {/* Submit Button */}
                    {isEditing && (
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                aria-label="Save profile changes"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

PersonalInfoTab.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        role: PropTypes.string,
        profilePicture: PropTypes.string,
        createdAt: PropTypes.string,
    }),
};

PersonalInfoTab.defaultProps = {
    user: null,
};

export default PersonalInfoTab;
