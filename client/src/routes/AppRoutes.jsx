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
import AdminPanel from "../pages/AdminPanel";
import Signup from "../pages/Signup";
import PrivateRoute from "./PrivateRoute";

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
      <Route path="*" element={<NotFound />} />
      {/* <Route path="/admin" element={user.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />} /> */}
    </Routes>
  );
};

export default AppRoutes;