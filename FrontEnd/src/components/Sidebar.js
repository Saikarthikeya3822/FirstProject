// Sidebar.js
import React from "react";
import { FaSignOutAlt,FaTimes } from "react-icons/fa";
import Keycloak from "./keycloak.js";
import { useNavigate } from "react-router-dom";
import '../styles/Sidebar.css'
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear local storage
    localStorage.clear();

    // 2. Logout from keycloak and redirect to login page
    Keycloak.logout({ redirectUri: window.location.origin + "/" });

    // 3. Optional: navigate('/') for safety
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
                {/* ✅ ADD CLOSE BUTTON HERE */}
        <button className="close-btn" onClick={onClose} style={{ float: 'right', background: 'white', border: 'none', cursor: 'pointer' }}>
          <FaTimes size={35} />
        </button>
        <h2>Menu</h2>
        <ul>
          <li>Dashboard</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
