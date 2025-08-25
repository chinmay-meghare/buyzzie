import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "./productService";

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      // productService.getProduct returns response.data (MSW returns product object)
      const response = await productService.getProduct(productId);
      return response; // should be the product object
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch product"
      );
    }
  }
);

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch categories"
      );
    }
  }
);

const initialState = {
  products: [],
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

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.meta.page = 1; // Reset to first page when filters change
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
    setInitialLoad: (state, action) => {
      state.isInitialLoad = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // MSW returns raw product object for /api/products/:id
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.meta = action.payload.meta;
        state.isInitialLoad = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, clearFilters, clearError } =
  productSlice.actions;
export default productSlice.reducer;
