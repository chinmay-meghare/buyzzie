// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import AdminPanel from "../pages/AdminPanel";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      {/* <Route path="/admin" element={user.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />} /> */}
    </Routes>
  );
};

export default AppRoutes;