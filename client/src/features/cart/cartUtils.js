/**
 * Generates a unique cart item ID based on product ID and variations
 * This ensures that products with different sizes/colors are treated as separate items
 * @param {number} productId - The product ID
 * @param {string|null} size - Selected size (optional)
 * @param {string|null} color - Selected color (optional)
 * @returns {string} Unique cart item identifier
 */
export const generateCartItemId = (productId, size = null, color = null) => {
    const sizePart = size ? `_size_${size}` : '';
    const colorPart = color ? `_color_${color}` : '';
    return `${productId}${sizePart}${colorPart}`;
  };
  
  /**
   * Formats a cart item for display purposes
   * @param {Object} cartItem - The cart item object
   * @returns {Object} Formatted cart item
   */
  export const formatCartItem = (cartItem) => {
    if (!cartItem) {
      console.warn('formatCartItem: Invalid cart item');
      return null;
    }
  
    return {
      ...cartItem,
      displayName: cartItem.title,
      displayPrice: cartItem.price,
      displayImage: cartItem.images?.[0] || '',
      variationText: [cartItem.size, cartItem.color]
        .filter(Boolean)
        .join(' / '),
    };
  };
  
  /**
   * Calculates cart totals (subtotal, total, item count)
   * @param {Array} items - Array of cart items
   * @returns {Object} Object containing subtotal, total, and itemCount
   */
  export const calculateCartTotals = (items) => {
    if (!Array.isArray(items)) {
      console.warn('calculateCartTotals: Invalid items array');
      return { subtotal: 0, total: 0, itemCount: 0 };
    }
  
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return sum + itemTotal;
    }, 0);
  
    // For now, total equals subtotal (no taxes/shipping)
    // This can be extended later for taxes, shipping, discounts, etc.
    const total = subtotal;
  
    const itemCount = items.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);
  
    return {
      subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      total: Math.round(total * 100) / 100,
      itemCount,
    };
  };
  
  /**
   * Validates if a product can be added to cart based on stock
   * @param {Object} product - The product object
   * @param {number} requestedQuantity - Quantity to add
   * @param {Array} existingCartItems - Current cart items
   * @returns {Object} Validation result with isValid and error message
   */
  export const validateStockAvailability = (
    product,
    requestedQuantity = 1,
    existingCartItems = []
  ) => {
    if (!product) {
      return {
        isValid: false,
        error: 'Invalid product',
      };
    }
  
    if (!product.stock || product.stock < 1) {
      return {
        isValid: false,
        error: 'Product is out of stock',
      };
    }
  
    // Check if product already exists in cart
    const existingItem = existingCartItems.find((item) => item.id === product.id);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentCartQuantity + requestedQuantity;
  
    if (totalQuantity > product.stock) {
      return {
        isValid: false,
        error: `Only ${product.stock} items available in stock. You already have ${currentCartQuantity} in your cart.`,
      };
    }

    return {
      isValid: true,
      error: null,
    };
  };
  
  /**
   * Checks if user is authenticated by verifying JWT token in localStorage
   * @returns {boolean} True if user is authenticated
   */
  export const isUserAuthenticated = () => {
    try {
      const token = localStorage.getItem('buyzzie_token');
      return !!token; // Return true if token exists
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };