import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h3>Store Rating App</h3>
      <div className="navbar-links">
        <Link to="/change-password" className="navbar-link">
          Change Password
        </Link>
        <button onClick={logout} className="navbar-logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}
