import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import Register from "./components/Common/Register";
import Login from "./components/Common/Login";
import PublicLayout from "./Layout/PublicLayout";
import AdminLayout from "./Layout/AdminLayout";
import ProtectRoute from "./components/ProtectRoute";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import AddProducts from "./pages/Admin/AddProducts";
import Cart from "./pages/User/Cart";
import Checkout from "./pages/User/Checkout"; // Fix: Spelling corrected

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route element={<ProtectRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/add-products" element={<AddProducts />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;