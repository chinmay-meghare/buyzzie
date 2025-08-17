import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        }
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setLoading, setError, clearError } = cartSlice.actions
export default cartSlice.reducer
