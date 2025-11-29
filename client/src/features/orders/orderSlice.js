/**
 * Order Management Redux Slice
 * 
 * Handles order creation, retrieval, and state management.
 * Automatically clears cart after successful order placement.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from '../cart/cartSlice';
import api from '../../services/axios';

/**
 * Async thunk to create a new order
 * POSTs order data to /api/orders and clears cart on success
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/orders', orderData);
      
      // Clear cart after successful order creation
      dispatch(clearCart());
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to place order';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to fetch all orders for the current user
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/orders');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch orders';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to fetch a single order by ID
 */
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch order';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Clear current order from state
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Store the newly created order as current order
        if (action.payload.order) {
          state.currentOrder = action.payload.order;
          state.orders.unshift(action.payload.order);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders || action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentOrder = action.payload.order || action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders ?? [];
export const selectOrderById = (orderId) => (state) => 
  state.orders.orders.find((order) => order.id === orderId) ?? null;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export default orderSlice.reducer;