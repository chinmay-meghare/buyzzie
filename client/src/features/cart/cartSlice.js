import { createSlice } from '@reduxjs/toolkit';
import { calculateCartTotals, generateCartItemId } from './cartUtils';

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
  try {
    const token = localStorage.getItem('buyzzie_token');
    if (!token) {
      return { items: [], total: 0, subtotal: 0, itemCount: 0 };
    }
    
    const storedCart = localStorage.getItem(`buyzzie_cart_${token}`);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const totals = calculateCartTotals(parsedCart.items);
      return {
        items: parsedCart.items || [],
        ...totals,
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return { items: [], total: 0, subtotal: 0, itemCount: 0 };
};

// Save cart to localStorage
const saveCartToStorage = (items, token) => {
  try {
    if (token) {
      localStorage.setItem(`buyzzie_cart_${token}`, JSON.stringify({ items }));
      console.log('Cart saved to localStorage');
    }
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart from localStorage
    initializeCart: (state) => {
      const loadedCart = loadCartFromStorage();
      state.items = loadedCart.items;
      state.total = loadedCart.total;
      state.subtotal = loadedCart.subtotal;
      state.itemCount = loadedCart.itemCount;
      console.log('Cart initialized from localStorage:', state.items.length, 'items');
    },

    // Add item to cart with product variations support
    addToCart: (state, action) => {
      const { product, size, color, quantity = 1 } = action.payload;
      
      // Validate required fields
      if (!product || !product.id) {
        state.error = 'Invalid product data';
        console.error('addToCart: Invalid product data', product);
        return;
      }

      // Validate stock availability
      if (product.stock < quantity) {
        state.error = `Only ${product.stock} items available in stock`;
        console.error('addToCart: Insufficient stock', { requested: quantity, available: product.stock });
        return;
      }

      // Generate unique cart item ID based on product ID and variations
      const cartItemId = generateCartItemId(product.id, size, color);
      
      // Check if item with same variations already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.cartItemId === cartItemId
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability for new quantity
        if (newQuantity > product.stock) {
          state.error = `Cannot add more items. Only ${product.stock} items available in stock`;
          console.error('addToCart: Insufficient stock for quantity increase', {
            current: existingItem.quantity,
            requested: quantity,
            total: newQuantity,
            available: product.stock,
          });
          return;
        }
        
        existingItem.quantity = newQuantity;
        console.log('Cart item quantity updated:', cartItemId, 'new quantity:', newQuantity);
      } else {
        // Create new cart item with all necessary product data
        const newCartItem = {
          cartItemId,
          id: product.id,
          title: product.title,
          price: product.price,
          images: product.images || [],
          stock: product.stock,
          size: size || null,
          color: color || null,
          quantity: quantity,
          // Store additional product data for display
          category: product.category?.name || '',
          rating: product.rating || 0,
        };
        
        state.items.push(newCartItem);
        console.log('New item added to cart:', cartItemId);
      }

      // Clear any previous errors
      state.error = null;
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.total = totals.total;
      state.subtotal = totals.subtotal;
      state.itemCount = totals.itemCount;

      console.log('ALL Total listed here:' , 'total=', state.total, 'subtotal=', state.subtotal,'itemCount =', state.itemCount);
      

      // Save to localStorage
      const token = localStorage.getItem('buyzzie_token');
      saveCartToStorage(state.items, token);
    },

    // Remove item from cart completely
    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      const itemIndex = state.items.findIndex((item) => item.cartItemId === cartItemId);
      
      if (itemIndex >= 0) {
        state.items.splice(itemIndex, 1);
        console.log('Item removed from cart:', cartItemId);
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.total = totals.total;
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;

        // Save to localStorage
        const token = localStorage.getItem('buyzzie_token');
        saveCartToStorage(state.items, token);
      } else {
        console.warn('removeFromCart: Item not found', cartItemId);
      }
    },

    // Increment quantity
    incrementQuantity: (state, action) => {
      const cartItemId = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      
      if (item) {
        // Check stock availability
        if (item.quantity >= item.stock) {
          state.error = `Maximum ${item.stock} items available in stock`;
          console.warn('incrementQuantity: Stock limit reached', {
            current: item.quantity,
            available: item.stock,
          });
          return;
        }
        
        item.quantity += 1;
        console.log('Quantity incremented:', cartItemId, 'new quantity:', item.quantity);
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.total = totals.total;
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;
        
        console.log('Final Cart State', state);
        
        // Save to localStorage
        const token = localStorage.getItem('buyzzie_token');
        saveCartToStorage(state.items, token);
        
      } else {
        console.warn('incrementQuantity: Item not found', cartItemId);
      }
    },

    // Decrement quantity (minimum 1, then remove)
    decrementQuantity: (state, action) => {
      const cartItemId = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          console.log('Quantity decremented:', cartItemId, 'new quantity:', item.quantity);
        } else {
          // Remove item if quantity would be 0
          state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
          console.log('Item removed (quantity reached 0):', cartItemId);
        }
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.total = totals.total;
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;

        // Save to localStorage
        const token = localStorage.getItem('buyzzie_token');
        saveCartToStorage(state.items, token);
      } else {
        console.warn('decrementQuantity: Item not found', cartItemId);
      }
    },

    // Update quantity directly
    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      
      // Validate quantity
      if (!Number.isInteger(quantity) || quantity < 1) {
        state.error = 'Quantity must be at least 1';
        console.error('updateQuantity: Invalid quantity', quantity);
        return;
      }

      const item = state.items.find((item) => item.cartItemId === cartItemId);
      
      if (item) {
        // Check stock availability
        if (quantity > item.stock) {
          state.error = `Only ${item.stock} items available in stock`;
          console.error('updateQuantity: Insufficient stock', {
            requested: quantity,
            available: item.stock,
          });
          return;
        }
        
        item.quantity = quantity;
        console.log('Quantity updated:', cartItemId, 'new quantity:', quantity);
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.total = totals.total;
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;

        // Save to localStorage
        const token = localStorage.getItem('buyzzie_token');
        saveCartToStorage(state.items, token);
      } else {
        console.warn('updateQuantity: Item not found', cartItemId);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.subtotal = 0;
      state.itemCount = 0;
      state.error = null;
      console.log('Cart cleared');
      
      // Remove from localStorage
      const token = localStorage.getItem('buyzzie_token');
      if (token) {
        localStorage.removeItem(`buyzzie_cart_${token}`);
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      console.error('Cart error:', action.payload);
    },

    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectIsCartEmpty = (state) => state.cart.items.length === 0;

export default cartSlice.reducer;