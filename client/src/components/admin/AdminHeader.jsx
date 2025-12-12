/**
 * AdminHeader.jsx
 * 
 * Header component for admin panel with user info and logout.
 * Includes hamburger menu for mobile sidebar toggle.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuClick }) => {
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('buyzzie_user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('buyzzie_user');
        localStorage.removeItem('buyzzie_token');
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                        aria-label="Open sidebar menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Desktop Spacer */}
                    <div className="hidden lg:block" />

                    {/* User Info & Logout */}
                    <div className="flex items-center gap-4">
                        {/* User Info */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-200">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-400">{user?.role || 'Administrator'}</p>
                            </div>
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt={user.name || 'Admin'}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-gray-700">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            aria-label="Logout from admin panel"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

AdminHeader.propTypes = {
    onMenuClick: PropTypes.func.isRequired,
};

export default AdminHeader;
