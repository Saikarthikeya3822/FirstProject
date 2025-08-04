// EntryPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Welcome</span>
          <div className="navbar-nav ms-auto">
            <button
              className="btn btn-primary me-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Main Body (optional message or image) */}
      <div className="container mt-5 text-center">
        <h2>Welcome to Product Management App</h2>
        <p>Please login or register to continue.</p>
      </div>
    </div>
  );
};

export default EntryPage;
