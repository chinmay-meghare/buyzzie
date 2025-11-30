import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartItemCount,
} from "../features/cart/cartSlice";
import { createOrder } from "../features/orders/orderSlice";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import OrderSummary from "../components/checkout/OrderSummary";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const itemCount = useSelector(selectCartItemCount);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      navigate("/cart");
    }
  }, [itemCount, navigate]);

  // Calculate totals
  const shipping = cartSubtotal >= 50 ? 0 : 5.99;
  const tax = (cartSubtotal * 0.08).toFixed(2);
  const total = (
    parseFloat(cartSubtotal) +
    parseFloat(shipping) +
    parseFloat(tax)
  ).toFixed(2);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!shippingInfo.fullName.trim())
      errors.fullName = "Full name is required";
    if (!shippingInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = "Email is invalid";
    }
    if (!shippingInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (!shippingInfo.address.trim()) errors.address = "Address is required";
    if (!shippingInfo.city.trim()) errors.city = "City is required";
    if (!shippingInfo.state.trim()) errors.state = "State is required";
    if (!shippingInfo.zipCode.trim()) errors.zipCode = "ZIP code is required";

    if (paymentMethod === "Card") {
      if (!cardDetails.cardNumber.replace(/\s/g, "")) {
        errors.cardNumber = "Card number is required";
      } else if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
        errors.cardNumber = "Card number must be 16 digits";
      }
      if (!cardDetails.expiryDate)
        errors.expiryDate = "Expiry date is required";
      if (!cardDetails.cvv) {
        errors.cvv = "CVV is required";
      } else if (cardDetails.cvv.length !== 3) {
        errors.cvv = "CVV must be 3 digits";
      }
      if (!cardDetails.cardholderName.trim())
        errors.cardholderName = "Cardholder name is required";
    }

    if (!agreedToTerms) errors.terms = "You must agree to terms and conditions";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: cartItems,
      shippingAddress: shippingInfo,
      paymentMethod,
      subtotal: cartSubtotal,
      shipping: parseFloat(shipping),
      tax: parseFloat(tax),
      total: parseFloat(total),
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${result.orderId}`);
    } catch (error) {
      console.error("Order failed:", error);
      setFormErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. CHECKOUT HEADER */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-300">
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <a href="/cart" className="text-gray-500 hover:text-gray-700">
                  Cart
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Checkout</li>
            </ol>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-300">Checkout</h1>
          <p className="mt-2 text-gray-300">
            Complete your order by filling in the details below
          </p>
        </div>

        {/* MAIN LAYOUT: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* LEFT COLUMN (Forms) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 2. SHIPPING FORM */}
            <ShippingForm
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
              formErrors={formErrors}
            />

            {/* 3. PAYMENT METHOD SELECTOR */}
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              cardDetails={cardDetails}
              setCardDetails={setCardDetails}
              formErrors={formErrors}
            />

            {/* 4. TERMS & PLACE ORDER */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-300">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {formErrors.terms && (
                  <p className="text-red-500 text-sm">{formErrors.terms}</p>
                )}

                {/* Submit Error */}
                {formErrors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{formErrors.submit}</p>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Processing..." : `Place Order - $${total}`}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center text-sm text-gray-300">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure Checkout - Your information is protected
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Order Summary) */}
          <div className="lg:col-span-2">
            {/* 5. ORDER SUMMARY (Sticky on desktop) */}
            <div className="lg:sticky lg:top-8">
              <OrderSummary
                items={cartItems}
                subtotal={cartSubtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
