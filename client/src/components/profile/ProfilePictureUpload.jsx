/**
 * ProfilePictureUpload Component
 * 
 * Handles profile picture upload with preview, validation,
 * and base64 conversion for storage.
 */

import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

const ProfilePictureUpload = ({ currentPicture, onPictureChange }) => {
    const [preview, setPreview] = useState(currentPicture);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    /**
     * Validates and converts image file to base64
     */
    const handleFileChange = useCallback((event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('Image must be less than 2MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            setPreview(base64String);
            setError(null);
            onPictureChange(base64String);
        };

        reader.onerror = () => {
            setError('Failed to read image file');
        };

        reader.readAsDataURL(file);
    }, [onPictureChange]);

    /**
     * Triggers file input click
     */
    const handleButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    /**
     * Removes profile picture
     */
    const handleRemovePicture = useCallback(() => {
        setPreview(null);
        setError(null);
        onPictureChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onPictureChange]);

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture Preview */}
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600 shadow-lg">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Upload profile picture"
                >
                    {preview ? 'Change Photo' : 'Upload Photo'}
                </button>

                {preview && (
                    <button
                        type="button"
                        onClick={handleRemovePicture}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Remove profile picture"
                    >
                        Remove
                    </button>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Profile picture file input"
            />

            {/* Error Message */}
            {error && (
                <p
                    className="text-sm text-red-400"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </p>
            )}

            {/* Helper Text */}
            <p className="text-xs text-gray-400 text-center">
                Recommended: Square image, max 2MB
            </p>
        </div>
    );
};

ProfilePictureUpload.propTypes = {
    currentPicture: PropTypes.string,
    onPictureChange: PropTypes.func.isRequired,
};

ProfilePictureUpload.defaultProps = {
    currentPicture: null,
};

export default ProfilePictureUpload;
