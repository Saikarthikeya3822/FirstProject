// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  console.log("Login.jsx is rendering");
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        console.log("Login response:", data);
  
        if (response.ok) {
          localStorage.setItem("token", data.token); // store JWT token
          localStorage.setItem("role", data.role);
          console.log("Inside LoginPage");
          navigate("/home"); // redirect to HomePage
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Something went wrong. Try again.");
      }
    };
  
    return (
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    );
  };

export default Login;
