import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user"  // default to "user"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      alert("Registration failed: " + err.response.data.message);
    }
  };

  return (
  <div className="container">
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

      <label>Register as:</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="owner">Store Owner</option>
      </select>

      <button type="submit">Register</button>

      <p className="text-center mt-10">
        Already have an account? <Link to="/" className="link-primary">Login</Link>
      </p>
    </form>
  </div>
);

}
