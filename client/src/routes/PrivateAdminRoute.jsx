/**
 * PrivateAdminRoute.jsx
 * 
 * Higher-order component to protect admin routes.
 * Checks if user is authenticated AND has admin role.
 * Redirects non-admin users to home page.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('buyzzie_user') || 'null');

    // Check if user exists and has admin role
    const isAdmin = user && user.role === 'admin';

    if (!isAdmin) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('PrivateAdminRoute: Access denied. User is not an admin.');
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

PrivateAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateAdminRoute;
