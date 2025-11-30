import React, { useCallback, useMemo, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_CARD_STATE = {
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
};

// Built-in validation utilities
const validateCardNumber = (value) => {
  const digits = value.replace(/\s/g, '');
  
  if (!digits) return 'Card number is required';
  if (digits.length < 13) return 'Card number must be at least 13 digits';
  if (digits.length > 19) return 'Card number is too long';
  
  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0 ? null : 'Invalid card number';
};

const validateExpiryDate = (value) => {
  if (!value) return 'Expiry date is required';
  if (value.length < 5) return 'Invalid expiry date format';
  
  const [month, year] = value.split('/').map(str => parseInt(str, 10));
  
  if (!month || !year) return 'Invalid expiry date';
  if (month < 1 || month > 12) return 'Invalid month';
  
  const today = new Date();
  const currentYear = today.getFullYear() % 100;
  const currentMonth = today.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

const validateCvv = (value) => {
  if (!value) return 'CVV is required';
  if (value.length < 3) return 'CVV must be 3 digits';
  return null;
};

const validateCardholderName = (value) => {
  if (!value || !value.trim()) return 'Cardholder name is required';
  if (value.trim().length < 3) return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
  return null;
};

// Format utilities
const formatCardNumber = (value) => {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trimEnd();
};

const formatExpiryDate = (value) => {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCvv = (value) => {
  return (value ?? '').replace(/\D/g, '').slice(0, 3);
};

// Local state management with useReducer
const initialState = {
  localCardDetails: DEFAULT_CARD_STATE,
  localErrors: {},
  touchedFields: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        localCardDetails: {
          ...state.localCardDetails,
          [action.field]: action.value,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        localErrors: {
          ...state.localErrors,
          [action.field]: action.error,
        },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touchedFields: {
          ...state.touchedFields,
          [action.field]: true,
        },
      };
    case 'RESET_CARD':
      return {
        ...initialState,
      };
    case 'SYNC_FROM_PARENT':
      return {
        ...state,
        localCardDetails: action.cardDetails,
      };
    default:
      return state;
  }
};

const PaymentMethodSelector = ({
  paymentMethod = 'COD',
  setPaymentMethod,
  cardDetails,
  setCardDetails,
  formErrors,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Sync with parent props if provided
  useEffect(() => {
    if (cardDetails) {
      dispatch({ type: 'SYNC_FROM_PARENT', cardDetails });
    }
  }, [cardDetails]);
  
  // Clear card details when payment method changes
  useEffect(() => {
    if (paymentMethod !== 'Card') {
      dispatch({ type: 'RESET_CARD' });
      // Also clear parent state if setter exists
      if (setCardDetails) {
        setCardDetails(DEFAULT_CARD_STATE);
      }
    }
  }, [paymentMethod, setCardDetails]);
  
  const activeCardDetails = cardDetails || state.localCardDetails;
  const activeErrors = formErrors || state.localErrors;
  
  const paymentOptions = useMemo(() => ([
    { value: 'COD', label: 'Cash on Delivery', helper: 'Pay with cash when the order arrives.' },
    { value: 'Card', label: 'Credit / Debit Card', helper: 'Securely enter your card details.' },
    { value: 'UPI', label: 'UPI', helper: 'Use any UPI app to complete payment.' },
  ]), []);
  
  const handlePaymentChange = useCallback((event) => {
    const nextMethod = event.target.value;
    if (process.env.NODE_ENV === 'development') {
      console.log('Payment method changed', nextMethod);
    }
    if (setPaymentMethod) {
      setPaymentMethod(nextMethod);
    }
  }, [setPaymentMethod]);
  
  // Validation on blur
  const handleBlur = useCallback((fieldName) => {
    dispatch({ type: 'SET_TOUCHED', field: fieldName });
    
    const value = activeCardDetails[fieldName];
    let error = null;
    
    switch (fieldName) {
      case 'cardNumber':
        error = validateCardNumber(value);
        break;
      case 'expiryDate':
        error = validateExpiryDate(value);
        break;
      case 'cvv':
        error = validateCvv(value);
        break;
      case 'cardholderName':
        error = validateCardholderName(value);
        break;
      default:
        break;
    }
    
    dispatch({ type: 'SET_ERROR', field: fieldName, error });
  }, [activeCardDetails]);
  
  const handleCardInputChange = useCallback((fieldName, rawValue) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Card field update', { fieldName, rawValue });
    }
    
    let formattedValue = rawValue ?? '';
    
    if (fieldName === 'cardNumber') {
      formattedValue = formatCardNumber(formattedValue);
    } else if (fieldName === 'expiryDate') {
      formattedValue = formatExpiryDate(formattedValue);
    } else if (fieldName === 'cvv') {
      formattedValue = formatCvv(formattedValue);
    }
    
    // Update local state
    dispatch({ type: 'UPDATE_FIELD', field: fieldName, value: formattedValue });
    
    // Update parent if setter exists
    if (setCardDetails) {
      setCardDetails((prev) => ({
        ...DEFAULT_CARD_STATE,
        ...(prev ?? {}),
        [fieldName]: formattedValue,
      }));
    }
    
    // Clear error on change if field was touched
    if (state.touchedFields[fieldName]) {
      dispatch({ type: 'SET_ERROR', field: fieldName, error: null });
    }
  }, [setCardDetails, state.touchedFields]);
  
  // Validate all fields (can be called from parent)
  const validateAll = useCallback(() => {
    const errors = {
      cardNumber: validateCardNumber(activeCardDetails.cardNumber),
      expiryDate: validateExpiryDate(activeCardDetails.expiryDate),
      cvv: validateCvv(activeCardDetails.cvv),
      cardholderName: validateCardholderName(activeCardDetails.cardholderName),
    };
    
    Object.entries(errors).forEach(([field, error]) => {
      dispatch({ type: 'SET_ERROR', field, error });
      dispatch({ type: 'SET_TOUCHED', field });
    });
    
    return Object.values(errors).every(error => error === null);
  }, [activeCardDetails]);
  
  // Expose validation function to parent via ref or callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__paymentValidation = validateAll;
    }
  }, [validateAll]);
  
  return (
    <section className="bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-200">Payment Method</h2>
        <p className="mt-1 text-sm text-gray-200">
          Choose how you would like to complete your purchase.
        </p>
      </div>
      
      <div className="space-y-4" role="radiogroup" aria-label="Select payment method">
        {paymentOptions.map((option) => {
          const isSelected = paymentMethod === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-slate-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={isSelected}
                onChange={handlePaymentChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                aria-checked={isSelected}
              />
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500 mt-1">{option.helper}</p>
              </div>
            </label>
          );
        })}
      </div>
      
      {paymentMethod === 'Card' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-200">Card Details</h3>
          <p className="text-sm text-gray-200 mt-1">
            Mock UI only. No payment will be processed.
          </p>
          
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-200 mb-1">
                Card Number
              </label>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                autoComplete="cc-number"
                inputMode="numeric"
                value={activeCardDetails.cardNumber}
                onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                onBlur={() => handleBlur('cardNumber')}
                placeholder="1234 5678 9012 3456"
                aria-label="Card number"
                aria-invalid={Boolean(activeErrors.cardNumber)}
                aria-describedby={activeErrors.cardNumber ? 'cardNumber-error' : undefined}
                className={`w-full input-text px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeErrors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-slate-300'
                }`}
              />
              {activeErrors.cardNumber && (
                <p
                  id="cardNumber-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {activeErrors.cardNumber}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-200 mb-1">
                Cardholder Name
              </label>
              <input
                id="cardholderName"
                name="cardholderName"
                type="text"
                autoComplete="cc-name"
                value={activeCardDetails.cardholderName}
                onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                onBlur={() => handleBlur('cardholderName')}
                placeholder="As printed on the card"
                aria-label="Cardholder name"
                aria-invalid={Boolean(activeErrors.cardholderName)}
                aria-describedby={activeErrors.cardholderName ? 'cardholderName-error' : undefined}
                className={`w-full input-text px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeErrors.cardholderName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-slate-300'
                }`}
              />
              {activeErrors.cardholderName && (
                <p
                  id="cardholderName-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {activeErrors.cardholderName}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-200 mb-1">
                  Expiry Date (MM/YY)
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={activeCardDetails.expiryDate}
                  onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                  onBlur={() => handleBlur('expiryDate')}
                  placeholder="08/27"
                  aria-label="Card expiry date"
                  aria-invalid={Boolean(activeErrors.expiryDate)}
                  aria-describedby={activeErrors.expiryDate ? 'expiryDate-error' : undefined}
                  className={`w-full input-text px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-slate-300'
                  }`}
                  maxLength={5}
                />
                {activeErrors.expiryDate && (
                  <p
                    id="expiryDate-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                    aria-live="polite"
                  >
                    {activeErrors.expiryDate}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-200 mb-1">
                  CVV
                </label>
                <input
                  id="cvv"
                  name="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={activeCardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                  onBlur={() => handleBlur('cvv')}
                  placeholder="123"
                  aria-label="Card security code"
                  aria-invalid={Boolean(activeErrors.cvv)}
                  aria-describedby={activeErrors.cvv ? 'cvv-error' : undefined}
                  className={`w-full input-text px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeErrors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-slate-300'
                  }`}
                  maxLength={3}
                />
                {activeErrors.cvv && (
                  <p
                    id="cvv-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                    aria-live="polite"
                  >
                    {activeErrors.cvv}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l4.707-4.707z"
                  clipRule="evenodd"
                />
              </svg>
              All entries stay on this device for demo purposes.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

PaymentMethodSelector.propTypes = {
  paymentMethod: PropTypes.oneOf(['COD', 'Card', 'UPI']),
  setPaymentMethod: PropTypes.func,
  cardDetails: PropTypes.shape({
    cardNumber: PropTypes.string,
    expiryDate: PropTypes.string,
    cvv: PropTypes.string,
    cardholderName: PropTypes.string,
  }),
  setCardDetails: PropTypes.func,
  formErrors: PropTypes.shape({
    cardNumber: PropTypes.string,
    expiryDate: PropTypes.string,
    cvv: PropTypes.string,
    cardholderName: PropTypes.string,
  }),
};

export default React.memo(PaymentMethodSelector);