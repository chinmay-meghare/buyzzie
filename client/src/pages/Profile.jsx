import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import {
  clearError,
  clearSuccessMessage,
  selectUserError,
  selectUserSuccessMessage,
} from '../features/user/userSlice';
import PersonalInfoTab from '../components/profile/PersonalInfoTab';
import AddressesTab from '../components/profile/AddressesTab';
import SecurityTab from '../components/profile/SecurityTab';
import OrderHistoryTab from '../components/profile/OrderHistoryTab';
import useScrollRestoration from '../hooks/useScrollRestoration';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: 'user' },
  { id: 'addresses', label: 'Addresses', icon: 'location' },
  { id: 'security', label: 'Security', icon: 'lock' },
  { id: 'orders', label: 'Order History', icon: 'shopping' },
];

const Profile = () => {
  useScrollRestoration();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from auth state
  const user = useSelector((state) => state.auth.user);
  const error = useSelector(selectUserError);
  const successMessage = useSelector(selectUserSuccessMessage);

  const [activeTab, setActiveTab] = useState('personal');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  /**
   * Handles tab change
   */
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    // Clear messages when switching tabs
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  /**
   * Handles logout
   */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  /**
   * Auto-dismiss success messages after 3 seconds
   */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  /**
   * Renders tab icon
   */
  const renderTabIcon = useCallback((iconType) => {
    const iconClass = "w-5 h-5";

    switch (iconType) {
      case 'user':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'location':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'lock':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'shopping':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      default:
        return null;
    }
  }, []);

  /**
   * Renders active tab content
   */
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab user={user} />;
      case 'addresses':
        return <AddressesTab />;
      case 'security':
        return <SecurityTab />;
      case 'orders':
        return <OrderHistoryTab />;
      default:
        return <PersonalInfoTab user={user} />;
    }
  }, [activeTab, user]);

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Message Banner */}
        {successMessage && (
          <div
            className="mb-6 bg-green-900 border border-green-500 text-green-200 px-6 py-4 rounded-lg shadow-lg animate-slideDown"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message Banner */}
        {error && (
          <div
            className="mb-6 bg-red-900 border border-red-500 text-red-200 px-6 py-4 rounded-lg shadow-lg"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(clearError())}
                className="text-red-200 hover:text-white transition-colors"
                aria-label="Dismiss error"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Profile Picture or Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600 flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-200">{user.name ?? 'User'}</h1>
                <p className="text-sm text-gray-400">{user.email ?? ''}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area - Bento Grid Layout */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Sidebar - Desktop Tabs */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-md p-4 sticky top-6">
              <nav className="space-y-2" aria-label="Profile navigation">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left font-medium transition-all ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {renderTabIcon(tab.icon)}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Tab Selector */}
          <div className="lg:hidden mb-6">
            <label htmlFor="tab-select" className="sr-only">
              Select tab
            </label>
            <select
              id="tab-select"
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="animate-slideIn">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;