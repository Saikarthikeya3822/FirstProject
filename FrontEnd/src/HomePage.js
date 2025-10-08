import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProducts, deleteAllProducts, fetchCartItems, filterFetchProducts } from "./service/productService";
import './styles/HomePage.css';
import Sidebar from "./components/Sidebar";
import { FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import './styles/Pagination.css';
import useUnauthorizedHandler from "./components/UnauthorizedHandler";
import SessionPopup from "./components/SessionPopup";
import CartList from "./components/CartList";
import axios from "axios";
import keycloak from './components/keycloak';
const HomePage = () => {
  const [view, setView] = useState("view");
  const [searchProducts, setsearchProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
  const [showNoAcessPopup, setshowNoAcessPopup] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [profilePic, setProfilePic] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [input, setInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const handleOkClick = () => {
    debugger
    console.log("Inside  handleOkClick");
    setShowSessionExpiredPopup(false);
    setshowNoAcessPopup(false);
    navigate("/"); // Navigate to LoginPage.jsx
  };
  const handleSearch = async (value) => {
    const token = localStorage.getItem("token");
    if (value.trim() == "") {
      setsearchProducts(products);
      setView("view");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/products/search?keyword=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log("after search recived data", data);
      setsearchProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };
  const fetchFilteredProducts = async () => {
    try {
      const data = await filterFetchProducts(statusFilter, priceFilter);
      setFilterProducts(data);
      setView("filter");
    } catch (err) {
      console.error("Error fetching filtered products", err);
    }
  };


  useEffect(() => {
    // if (!localStorage.getItem("token")) {
    //   handleUnauthorized();
    // }
    if (view === "view") {
      fetchProducts();
    }
  }, [view]);
  useEffect(() => {
    if (keycloak?.tokenParsed?.picture) {
      setProfilePic(keycloak.tokenParsed.picture); // ✅ update state
    }
  }, [keycloak]); // run when keycloak changes


  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      const cartData = await fetchCartItems();
      setCartItems(cartData);

    } catch (error) {
  // Now passing the actual error object
        handleUnauthorized(error); 
        
        // Add a generic error message for other errors
        if (error.message !== "SESSION_EXPIRED_LOGOUT") {
           // Avoid showing error if the interceptor is handling the full logout
           setError(error.message || "Failed to load data."); 
        }
    }
    finally {
      setLoading(false);
    }
  };

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
  const {
    showSessionExpiredPopup,
    setShowSessionExpiredPopup,
    showNoAccessPopup,
    setShowNoAccessPopup,
    handleUnauthorized,
  } = useUnauthorizedHandler();

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <button
            className="btn btn-outline-light me-3" // Using light button for visibility
            onClick={() => setSidebarOpen(true)} // Crucial line to open it!
            style={{ width: "55px", height: "55px" }}
          >
            <i className="bi bi-list"></i> {/* Bootstrap list/hamburger icon */}
          </button>
          <span className="navbar-brand">Product Management</span>
          <span className="mx-auto text-white fw-bold">
            {keycloak?.tokenParsed?.name
              ? `Welcome, ${keycloak.tokenParsed.name}`
              : keycloak?.tokenParsed?.preferred_username
                ? `Welcome, ${keycloak.tokenParsed.preferred_username}`
                : ""}
          </span>
          <div className="navbar-nav">
            {/* View Products */}
            <button
              className={`btn btn-outline-success position-relative me-2 ${view === "view" ? "active" : ""}`} style={{ width: "151px", height: "55px" }}
              onClick={() => setView("view")}
            >
              <i className="bi bi-box-seam me-1"></i> {/* Product icon */}
              View Products
            </button>
            {/* Add Product */}
            <button
              className={`btn btn-outline-warning position-relative me-2 ${view === "add" ? "active" : ""}`}
              onClick={() => setView("add")} style={{ width: "151px", height: "55px" }}
            >
              <i className="bi bi-plus-circle me-1"></i> {/* Add icon */}
              Add Product
            </button>
            <button
              className={`btn btn-outline-primary position-relative me-2 ${view === "cart" ? "active" : ""}`}
              onClick={() => setView("cart")} style={{ width: "151px", height: "55px" }}
            >
              <i className="bi bi-cart3 me-1"></i> {/* Bootstrap cart icon */}
              View Cart
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItems.length}
                  <span className="visually-hidden">cart items</span>
                </span>
              )}
            </button>

            {role === "ADMIN" && (
              <button className="nav-link btn btn-danger" onClick={handleDeleteAll}>
                Delete All Products
              </button>
            )}
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products..."
              value={input}
              onChange={(e) => {
                // console.log('event handlre input e value',e)
                setInput(e.target.value);
                handleSearch(e.target.value); // 🔑 call search API as user types
                setView("search");
              }} style={{ width: "160px", height: "55px" }} />

            {/* /*use this when add oath2/ */}
            {profilePic && (
              <img
                src={profilePic}
                alt="Profile"
                className="rounded-circle ms-3"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      </nav>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* 🔍 Filters Section – always visible under navbar */}
      <div className="container mt-3 d-flex gap-2">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Price Filter */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="">All Prices</option>
          <option value="low">Low (Ascending)</option>
          <option value="high">High (Descending)</option>
        </select>

        <button className="btn btn-primary" onClick={fetchFilteredProducts}>
          Apply Filter
        </button>
      </div>
      {/* Main Content Switch */}
      <div className="container mt-4">
        {view === "view" ? (
          <ProductList products={products} loading={loading} error={error} fetchProducts={fetchProducts} />
        ) : view === "add" ? (
          <ProductForm setProducts={setProducts} setView={setView} />
        ) : view === "search" ? (
          <ProductList products={searchProducts} loading={loading} error={error} fetchProducts={fetchProducts} />
        ) : view === "filter" ? (
          <ProductList products={filterProducts} loading={loading} error={error} fetchProducts={fetchProducts} />
        ) : (
          <CartList />
        )}
      </div>

      {/* Session Expired Popup */}
      <SessionPopup
        visible={showSessionExpiredPopup}
        onClose={() => setShowSessionExpiredPopup(false)}
        title="Session Expired"
        message="Please log in again."
      />
      <SessionPopup
        visible={showNoAccessPopup}
        onClose={() => setShowNoAccessPopup(false)}
        title="No Access"
        message="You don’t have access to this resource."
      />

    </div>
  );
};
export default HomePage;