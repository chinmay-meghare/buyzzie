import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../products/productService";

// === Thunks ===

// Fetch all products (with pagination, filters, sorting)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      // MSW/backend returns { data: [...], meta: {...} }
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(productId);
      return response; // raw product object
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch product"
      );
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response; // array of categories
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch categories"
      );
    }
  }
);

// === Initial state ===
const initialState = {
  products: [],
  product: null,
  categories: [],
  meta: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    q: "",
    category: [],
    minPrice: null,
    maxPrice: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  loading: false,
  categoriesLoading: false,
  error: null,
};

// === Slice ===
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.meta.page = 1; // reset page when filters change
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        q: "",
        category: [],
        minPrice: null,
        maxPrice: null,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      state.meta.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    // Single product
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload?.data ?? action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const {
  setFilters,
  setPage,
  clearFilters,
  clearError,
  clearProduct,
} = productSlice.actions;

export default productSlice.reducer;