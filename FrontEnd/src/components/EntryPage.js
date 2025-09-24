// EntryPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "./keycloak";
import { useEffect } from "react";


const EntryPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
      // This effect runs on every render, but the checks ensure it only
      // navigates when needed.
      if (localStorage.getItem("token")) {
        // User is authenticated, redirect to the home page
        console.log("inside authHandle authen");
        navigate("/home");
      } else {
        // User is not authenticated, redirect to the login page
        console.log("inside not authenticated");
        navigate("/");
      }
    }, [navigate]);

   const handleKeycloakLogin = () => {
    // This will redirect to the Keycloak login page, where users can
    // enter their credentials or choose a social provider.
    keycloak.login()
      .then(() => {
        if (keycloak.authenticated) {
          console.log("Keycloak login success:", keycloak.token);
        }
      })
      .catch(err => console.error("Keycloak login failed:", err));
  };

  const handleGoogleLogin = () => {
    // The idpHint directs Keycloak to automatically choose the 'google' identity provider.
    keycloak.login({ idpHint: 'google' })
      .then(() => {
        if (keycloak.authenticated) {
          console.log("Google login success:", keycloak.token);
          // Redirect to home or another protected page after authentication
          // navigate('/home');
        }
      })
      .catch(err => console.error("Google login failed:", err));
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Welcome</span>
          <div className="navbar-nav ms-auto">
            <button
              className="btn btn-primary me-2"
              onClick={handleKeycloakLogin}
            >
              Login
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
              <button
              className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300"
              onClick={handleGoogleLogin}
            >
              Login with Google
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
