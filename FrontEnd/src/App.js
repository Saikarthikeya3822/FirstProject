import logo from './logo.svg';
import './App.css';
import HomePage from './HomePage';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update token in state if localStorage changes (e.g., after login)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={token ? <HomePage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={!token ? <Login /> : <Navigate to="/home" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
