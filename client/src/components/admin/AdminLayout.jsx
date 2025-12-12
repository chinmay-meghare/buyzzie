/**
 * AdminLayout.jsx
 * 
 * Main layout wrapper for admin panel with sidebar and header.
 * Provides responsive design with collapsible sidebar on mobile.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main Content Area */}
            <div className="lg:pl-64">
                {/* Header */}
                <AdminHeader onMenuClick={toggleSidebar} />

                {/* Page Content */}
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 z-20 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default AdminLayout;
