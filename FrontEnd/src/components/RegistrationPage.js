import React, { useState } from "react";
import { registerUser } from "../service/productService";
import { useNavigate } from "react-router-dom";
const RegistrationPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleRegister =async  (e) => {
    e.preventDefault();

  try {
    await registerUser({ username, password });
    alert("Registration successful! You can now log in.");
    setUsername("");
    setPassword("");
    navigate("/login"); // redirect to login
  } catch (error) {
    console.log("error message",error.message);
    if (error.message.includes("Registration failed")) {
      alert("User is already registered. Please login.");
    } else {
      alert("Something went wrong. Try again.");
    } 
  }
    //✅ Clear fields after registration
    setUsername("");
    setPassword("");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Register</h3>
          <form onSubmit={handleRegister} autoComplete="off">
            <div className="form-group mb-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;