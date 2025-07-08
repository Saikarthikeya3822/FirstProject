import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProducts,deleteAllProducts } from "./service/productService";
import './styles/HomePage.css';
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const [view, setView] = useState("view"); // Tracks the current view: "view" or "add"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleUnauthorized = () => {
    debugger
    console.log("Inside  handleUnauthorized");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setLoading(false);
    setShowSessionExpiredPopup(true); // Show custom popup
  };

    const handleOkClick = () => {
    debugger
    console.log("Inside  handleOkClick");
    setShowSessionExpiredPopup(false);
    navigate("/"); // Navigate to LoginPage.jsx
  };

 useEffect(() => {
  if (view === "view") {
    fetchProducts();
  }
}, [view]);

  // Fetch products from the backend
  const fetchProducts = async () => {
    debugger
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.log("Status:", error.response?.status);
    if (error.response && error.response.status === 401) {
       handleUnauthorized();
        return;
    }
    } 
    finally {
      setLoading(false);
    }
  };

  // Handle deletion of all products
  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all products?");
    if (!confirmDelete) return;

    try {
      await deleteAllProducts(); // Delete all products from the database
      setProducts([]); // Immediately clear the products state (UI update)
      alert("All products deleted successfully.");
    } catch (error) {
      console.error("Error deleting all products:", error);
      alert("Failed to delete all products.");
    }
  };


  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Product Management</span>
          <div className="navbar-nav">
            <button
              className={`nav-link btn ${view === "view" ? "active" : ""}`}
              onClick={() => setView("view")}
            >
              View Products
            </button>
            <button
              className={`nav-link btn ${view === "add" ? "active" : ""}`}
              onClick={() => setView("add")}
            >
              Add Product
            </button>
            {role === "ADMIN" && (
            <button className="nav-link btn btn-danger" onClick={handleDeleteAll}>
              Delete All Products
            </button>
)}
            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        {view === "view" ? (
          // View Products
          <ProductList products={products} loading={loading} error={error} fetchProducts={fetchProducts}/>
        ) : (
          // Add Product Form
          <ProductForm fetchProducts={fetchProducts} setView={setView} />
        )}
      </div>
      {/* Session Expired Modal */}
      {showSessionExpiredPopup && (
      <div className="session-overlay">
        <div className="session-popup">
        <h3>Session Expired</h3>
        <p>Please log in again.</p>
      <button onClick={handleOkClick}>OK</button>
        </div>
    </div>
)}
    </div>
  );
};

export default HomePage;