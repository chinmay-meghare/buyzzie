// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Collection from "../pages/Collection";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import PrivateRoute from "./PrivateRoute";
import PrivateAdminRoute from "./PrivateAdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductList from "../pages/admin/ProductList";
import ProductForm from "../pages/admin/ProductForm";
import OrderList from "../pages/admin/OrderList";
import CustomerList from "../pages/admin/CustomerList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route
        path="/order-confirmation/:orderId"
        element={
          <PrivateRoute>
            <OrderConfirmation />
          </PrivateRoute>
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <PrivateAdminRoute>
            <AdminLayout />
          </PrivateAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="customers" element={<CustomerList />} />
        {/* Additional admin routes will be added in later phases */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;