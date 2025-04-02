import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProducts,deleteAllProducts } from "./service/productService";

import './styles/HomePage.css';
import axios from "axios";

const HomePage = () => {
  const [view, setView] = useState("view"); // Tracks the current view: "view" or "add"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  //  Filter products based on searchQuery
  const filteredProducts = products.filter((product) =>
    (product.prodName && product.prodName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    ( product.isActive !== undefined && 
    (searchQuery.toLowerCase() === 'active' && product.isActive === true || 
     searchQuery.toLowerCase() === 'Inactive' && product.isActive === false))
  );



  // Function to fetch products (searching with backend)
  // const fetchSearchedProducts = async (query) => {
  //   if (!query) {
  //     fetchProducts(); // Fetch all products when search is cleared
  //     return;
  //   }
    
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`http://localhost:8080/products/search?keyword=${query}`);
  //     setProducts(response.data);
  //     setError(null);
  //   } catch (err) {
  //     setError("Error fetching search results.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search (Wait before calling API to avoid too many requests)
  // useEffect(() => {
  //   const delaySearch = setTimeout(() => {
  //     fetchSearchedProducts(searchQuery);
  //   }, 500); // 500ms delay before API call

  //   return () => clearTimeout(delaySearch);
  // }, [searchQuery]);

  // Load products on component mount or when view changes to "view"

  useEffect(() => {
    if (view === "view") {
      fetchProducts();
    }
  }, [view]);

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
            <button className="nav-link btn btn-danger" onClick={handleDeleteAll}>
              Delete All Products
            </button>
            {/* Search Bar */}
          {view === "view" && (
            <input
              type="text"
              className="form-control ms-3 w-25"
              placeholder="Search Products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container ">
        {view === "view" ? (
          // View Products
          <ProductList products={filteredProducts} loading={loading} error={error} fetchProducts={fetchProducts} />
        ) : (
          // Add Product Form
          <ProductForm fetchProducts={fetchProducts} setView={setView} />
        )}
      </div>
    </div>
  );
};

export default HomePage;