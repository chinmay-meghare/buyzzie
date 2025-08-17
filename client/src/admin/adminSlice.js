import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  products: [],
  orders: [],
  loading: false,
  error: null
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setProducts: (state, action) => {
      state.products = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
    },
    addProduct: (state, action) => {
      state.products.push(action.payload)
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload)
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

export const { 
  setUsers, 
  setProducts, 
  setOrders, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  setLoading, 
  setError, 
  clearError 
} = adminSlice.actions

export default adminSlice.reducer 