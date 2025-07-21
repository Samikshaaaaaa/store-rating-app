import React, { useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/change-password", form);
      alert("Password changed successfully");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

