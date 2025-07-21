import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoreList from "./pages/StoreList";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
