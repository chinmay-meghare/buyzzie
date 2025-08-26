import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../user/userSlice";
import cartReducer from "../cart/cartSlice";
import adminReducer from "../admin/adminSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
