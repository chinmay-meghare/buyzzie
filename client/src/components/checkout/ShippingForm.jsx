/**
 * ShippingForm Component
 * 
 * Handles shipping information input with real-time validation.
 * Features controlled components, field-level error messages,
 * and defensive programming practices.
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Validates email format using RFC 5322 simplified regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
const validateEmailFormat = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates phone number (10 digits, allows formatting)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone is valid
 */
const validatePhoneFormat = (phone) => {
  if (typeof phone !== 'string') return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

/**
 * Formats phone number as user types (XXX-XXX-XXXX)
 * @param {string} value - Raw phone input
 * @returns {string} - Formatted phone number
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
 * Validates a single field based on its name and value
 * @param {string} fieldName - Name of the field
 * @param {string} value - Current field value
 * @returns {string|null} - Error message or null if valid
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
      if (!validateEmailFormat(trimmedValue)) {
        return 'Please enter a valid email address';
      }
      return null;
    
    case 'phone':
      if (!trimmedValue) return 'Phone number is required';
      if (!validatePhoneFormat(trimmedValue)) {
        return 'Phone number must be 10 digits';
      }
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

const ShippingForm = ({ shippingInfo, setShippingInfo, formErrors = {} }) => {
  // Defensive check: ensure shippingInfo is an object
  const safeShippingInfo = useMemo(() => {
    return shippingInfo ?? {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    };
  }, [shippingInfo]);

  // Defensive check: ensure formErrors is an object
  const safeFormErrors = useMemo(() => {
    return formErrors ?? {};
  }, [formErrors]);

  /**
   * Handles input change with validation
   * Clears field error on change for better UX
   */
  const handleInputChange = useCallback((fieldName, value) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ShippingForm: Field changed', { fieldName, value });
    }

    // Special handling for phone number formatting
    if (fieldName === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setShippingInfo((prev) => ({
        ...prev,
        [fieldName]: formattedPhone,
      }));
      return;
    }

    // Standard field update
    setShippingInfo((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, [setShippingInfo]);

  /**
   * Handles field blur - validates on blur for better UX
   */
  const handleFieldBlur = useCallback((fieldName) => {
    const value = safeShippingInfo[fieldName] ?? '';
    const error = validateField(fieldName, value);
    
    if (process.env.NODE_ENV === 'development' && error) {
      console.warn('ShippingForm: Validation error', { fieldName, error });
    }
  }, [safeShippingInfo]);

  // Country options - can be moved to config if needed
  const countryOptions = useMemo(() => [
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
  ], []);

  if (process.env.NODE_ENV === 'development') {
    console.log('ShippingForm: Rendering with', Object.keys(safeShippingInfo).length, 'fields');
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-200">Shipping Information</h2>
        <p className="mt-1 text-sm text-gray-200">
          Enter your delivery details below
        </p>
      </div>

      <form className="space-y-5" noValidate>
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={safeShippingInfo.fullName ?? ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            onBlur={() => handleFieldBlur('fullName')}
            className={`w-full input-text px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              safeFormErrors.fullName
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-slate-300'
            }`}
            placeholder="John Doe"
            aria-label="Full name"
            aria-invalid={!!safeFormErrors.fullName}
            aria-describedby={safeFormErrors.fullName ? 'fullName-error' : undefined}
            autoComplete="name"
            maxLength={100}
          />
          {safeFormErrors.fullName && (
            <p
              id="fullName-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {safeFormErrors.fullName}
            </p>
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
          <input
            type="email"
            id="email"
            name="email"
            value={safeShippingInfo.email ?? ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            className={`w-full px-4 input-text py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              safeFormErrors.email
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-slate-300'
            }`}
            placeholder="john.doe@example.com"
            aria-label="Email address"
            aria-invalid={!!safeFormErrors.email}
            aria-describedby={safeFormErrors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {safeFormErrors.email && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {safeFormErrors.email}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={safeShippingInfo.phone ?? ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onBlur={() => handleFieldBlur('phone')}
            className={`w-full px-4 input-text py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              safeFormErrors.phone
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-slate-300'
            }`}
            placeholder="123-456-7890"
            aria-label="Phone number"
            aria-invalid={!!safeFormErrors.phone}
            aria-describedby={safeFormErrors.phone ? 'phone-error' : undefined}
            autoComplete="tel"
            maxLength={12}
          />
          {safeFormErrors.phone && (
            <p
              id="phone-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {safeFormErrors.phone}
            </p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={safeShippingInfo.address ?? ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            onBlur={() => handleFieldBlur('address')}
            className={`w-full px-4 input-text py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              safeFormErrors.address
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-slate-300'
            }`}
            placeholder="123 Main Street, Apt 4B"
            aria-label="Street address"
            aria-invalid={!!safeFormErrors.address}
            aria-describedby={safeFormErrors.address ? 'address-error' : undefined}
            autoComplete="street-address"
          />
          {safeFormErrors.address && (
            <p
              id="address-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {safeFormErrors.address}
            </p>
          )}
        </div>

        {/* City and State Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* City Field */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={safeShippingInfo.city ?? ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => handleFieldBlur('city')}
              className={`w-full px-4 input-text py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                safeFormErrors.city
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-slate-300'
              }`}
              placeholder="Mumbai"
              aria-label="City"
              aria-invalid={!!safeFormErrors.city}
              aria-describedby={safeFormErrors.city ? 'city-error' : undefined}
              autoComplete="address-level2"
            />
            {safeFormErrors.city && (
              <p
                id="city-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {safeFormErrors.city}
              </p>
            )}
          </div>

          {/* State Field */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={safeShippingInfo.state ?? ''}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onBlur={() => handleFieldBlur('state')}
              className={`w-full px-4 input-text py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                safeFormErrors.state
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-slate-300'
              }`}
              placeholder="Maharashtra"
              aria-label="State"
              aria-invalid={!!safeFormErrors.state}
              aria-describedby={safeFormErrors.state ? 'state-error' : undefined}
              autoComplete="address-level1"
            />
            {safeFormErrors.state && (
              <p
                id="state-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {safeFormErrors.state}
              </p>
            )}
          </div>
        </div>

        {/* ZIP Code and Country Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* ZIP Code Field */}
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={safeShippingInfo.zipCode ?? ''}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              onBlur={() => handleFieldBlur('zipCode')}
              className={`w-full px-4 input-text py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                safeFormErrors.zipCode
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-slate-300'
              }`}
              placeholder="400001"
              aria-label="ZIP code"
              aria-invalid={!!safeFormErrors.zipCode}
              aria-describedby={safeFormErrors.zipCode ? 'zipCode-error' : undefined}
              autoComplete="postal-code"
              maxLength={10}
            />
            {safeFormErrors.zipCode && (
              <p
                id="zipCode-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {safeFormErrors.zipCode}
              </p>
            )}
          </div>

          {/* Country Field */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={safeShippingInfo.country ?? 'India'}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 input-text py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-slate-300"
              aria-label="Country"
              autoComplete="country"
            >
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

// PropTypes for type safety and documentation
ShippingForm.propTypes = {
  shippingInfo: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  setShippingInfo: PropTypes.func.isRequired,
  formErrors: PropTypes.objectOf(PropTypes.string),
};

ShippingForm.defaultProps = {
  formErrors: {},
};

export default ShippingForm;