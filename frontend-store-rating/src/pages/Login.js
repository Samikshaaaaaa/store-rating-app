import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ must be declared here

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ JWT token save
      localStorage.setItem("token", res.data.token);

      const role = res.data.user.role;

      // ✅ Role-based routing
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "owner") navigate("/owner-dashboard");
      else navigate("/stores");

    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || "Server error");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
}
