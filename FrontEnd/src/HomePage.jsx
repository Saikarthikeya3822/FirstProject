import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProducts,deleteAllProducts,searchProducts } from "./service/productService";
import './styles/HomePage.css';

const HomePage = () => {
  const [view, setView] = useState("view"); // Tracks the current view: "view" or "add"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

   // Load products on component mount or when view changes to "view"
   useEffect(() => {
    if (view === "view") {
      fetchProducts();
    }
  }, [view]);
     // Debounced search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (keyword.trim() !== '') {
        fetchSearchResults(keyword);
      } else {
        fetchProducts();
      }
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [keyword]);
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

  const fetchSearchResults = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(searchTerm);
      setProducts(data);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search products.");
    } finally {
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
            <button className="nav-link btn btn-danger" onClick={handleDeleteAll}>
              Delete All Products
            </button>
          </div>
          {/* Search */}
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
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
    </div>
  );
};

export default HomePage;