/**
 * SecurityTab Component
 * 
 * Handles password changes and account deletion with
 * real-time validation, password strength indicator, and confirmation modals.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    changePassword,
    deleteUserAccount,
    selectUserLoading,
} from '../../features/user/userSlice';
import { logout } from '../../features/auth/authSlice';
import DeleteConfirmModal from './DeleteConfirmModal';

/**
 * Validates password strength
 */
const validatePasswordStrength = (password) => {
    if (!password) return { strength: 'none', message: '' };

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough) {
        return { strength: 'weak', message: 'Password must be at least 8 characters' };
    }

    const criteriaCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

    if (criteriaCount < 2) {
        return { strength: 'weak', message: 'Weak password' };
    } else if (criteriaCount === 2 || criteriaCount === 3) {
        return { strength: 'medium', message: 'Medium strength password' };
    } else {
        return { strength: 'strong', message: 'Strong password' };
    }
};

const SecurityTab = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectUserLoading);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    /**
     * Password strength indicator
     */
    const passwordStrength = useMemo(() => {
        return validatePasswordStrength(passwordData.newPassword);
    }, [passwordData.newPassword]);

    /**
     * Check if passwords match
     */
    const passwordsMatch = useMemo(() => {
        if (!passwordData.newPassword || !passwordData.confirmPassword) return null;
        return passwordData.newPassword === passwordData.confirmPassword;
    }, [passwordData.newPassword, passwordData.confirmPassword]);

    /**
     * Check if form is valid
     */
    const isFormValid = useMemo(() => {
        return (
            passwordData.currentPassword.length > 0 &&
            passwordData.newPassword.length >= 8 &&
            passwordsMatch === true &&
            passwordStrength.strength !== 'weak'
        );
    }, [passwordData, passwordsMatch, passwordStrength]);

    /**
     * Handles password input change
     */
    const handlePasswordChange = useCallback((field, value) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
        setPasswordErrors((prev) => ({ ...prev, [field]: null }));
    }, []);

    /**
     * Toggles password visibility
     */
    const togglePasswordVisibility = useCallback((field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    }, []);

    /**
     * Handles password change submission
     */
    const handlePasswordSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Validate current password
        if (!passwordData.currentPassword) {
            setPasswordErrors({ currentPassword: 'Current password is required' });
            return;
        }

        // Validate new password
        if (passwordStrength.strength === 'weak') {
            setPasswordErrors({ newPassword: 'Password must be at least 8 characters with uppercase, lowercase, and number' });
            return;
        }

        // Validate passwords match
        if (!passwordsMatch) {
            setPasswordErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        try {
            await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })).unwrap();

            // Reset form on success
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setPasswordErrors({});
        } catch (error) {
            setPasswordErrors({ currentPassword: error });
            if (process.env.NODE_ENV === 'development') {
                console.error('SecurityTab: Failed to change password', error);
            }
        }
    }, [dispatch, passwordData, passwordStrength, passwordsMatch]);

    /**
     * Opens delete account modal
     */
    const handleDeleteAccountClick = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    /**
     * Confirms account deletion
     */
    const handleConfirmDelete = useCallback(async () => {
        try {
            await dispatch(deleteUserAccount()).unwrap();
            setIsDeleteModalOpen(false);
            setIsSuccessModalOpen(true);

            // Logout and redirect after 2 seconds
            setTimeout(() => {
                dispatch(logout());
                navigate('/');
            }, 2000);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('SecurityTab: Failed to delete account', error);
            }
        }
    }, [dispatch, navigate]);

    return (
        <div className="space-y-6">
            {/* Change Password Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-6">Change Password</h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    {/* Current Password */}
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                id="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                className={`w-full px-4 py-2 pr-12 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
                            >
                                {showPasswords.current ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {passwordErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{passwordErrors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                id="newPassword"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                className={`w-full px-4 py-2 pr-12 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                            >
                                {showPasswords.new ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'weak' ? 'bg-red-500' :
                                            passwordStrength.strength === 'medium' ? 'bg-yellow-500' :
                                                passwordStrength.strength === 'strong' ? 'bg-green-500' : 'bg-gray-600'
                                        }`}></div>
                                    <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'medium' || passwordStrength.strength === 'strong' ?
                                            (passwordStrength.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-600'
                                        }`}></div>
                                    <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'strong' ? 'bg-green-500' : 'bg-gray-600'
                                        }`}></div>
                                </div>
                                <p className={`text-xs ${passwordStrength.strength === 'weak' ? 'text-red-400' :
                                        passwordStrength.strength === 'medium' ? 'text-yellow-400' :
                                            'text-green-400'
                                    }`}>
                                    {passwordStrength.message}
                                </p>
                            </div>
                        )}

                        {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{passwordErrors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                id="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                className={`w-full px-4 py-2 pr-12 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                            >
                                {showPasswords.confirm ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Password Match Indicator */}
                        {passwordData.confirmPassword && passwordsMatch !== null && (
                            <p className={`mt-1 text-sm ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords don\'t match'}
                            </p>
                        )}

                        {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-400" role="alert">{passwordErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>

            {/* Delete Account Section */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 border-2 border-red-900">
                <div className="flex items-start gap-4">
                    {/* Warning Icon */}
                    <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-gray-400 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            type="button"
                            onClick={handleDeleteAccountClick}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Account?"
                message="Are you absolutely sure? This will permanently delete your account, all your data, addresses, and order history. This action cannot be undone."
                confirmText="Yes, Delete My Account"
                isLoading={loading}
            />

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-200 mb-2">Account Deleted Successfully</h3>
                        <p className="text-gray-400">Redirecting to home page...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityTab;
