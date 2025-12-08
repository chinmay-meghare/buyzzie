/**
 * DeleteConfirmModal Component
 * 
 * Reusable confirmation modal for delete actions with
 * focus trap, animations, and accessibility features.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    isLoading,
}) => {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    /**
     * Handle escape key press
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
            // Store current focus
            previousFocusRef.current = document.activeElement;

            // Focus modal
            modalRef.current?.focus();

            // Add escape key listener
            document.addEventListener('keydown', handleEscapeKey);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restore focus
            previousFocusRef.current?.focus();

            // Remove escape key listener
            document.removeEventListener('keydown', handleEscapeKey);

            // Restore body scroll
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 animate-fadeIn"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 animate-scaleIn transform transition-transform"
                style={{
                    animation: 'scaleIn 0.2s ease-out',
                }}
            >
                {/* Warning Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-900 rounded-full border-2 border-red-500">
                    <svg
                        className="w-6 h-6 text-red-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h3
                    id="modal-title"
                    className="text-xl font-bold text-gray-200 text-center mb-2"
                >
                    {title}
                </h3>

                {/* Message */}
                <p
                    id="modal-description"
                    className="text-gray-400 text-center mb-6"
                >
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Cancel deletion"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 hover:animate-shake"
                        aria-label={confirmText}
                    >
                        {isLoading ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        .hover\\:animate-shake:hover {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
        </div>
    );
};

DeleteConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmText: PropTypes.string,
    isLoading: PropTypes.bool,
};

DeleteConfirmModal.defaultProps = {
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    isLoading: false,
};

export default DeleteConfirmModal;
