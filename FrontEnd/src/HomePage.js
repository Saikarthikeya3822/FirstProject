import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getProducts,
  deleteAllProducts,
  fetchCartItems,
  filterFetchProducts,
  searchProducts,
} from "./service/productService";
import "./styles/HomePage.css";
import Sidebar from "./components/Sidebar";
import { FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Pagination.css";
import useUnauthorizedHandler from "./components/UnauthorizedHandler";
import SessionPopup from "./components/SessionPopup";
import CartList from "./components/CartList";
import keycloak from "./components/keycloak";
import SidebarComponent from "./components/Sidebar";
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import ChatBot from "./components/ChatBot";
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
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [input, setInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [highlightProduct, setHighlightProduct] = useState(null);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const handleOkClick = () => {
    console.log("Inside  handleOkClick");
    setShowSessionExpiredPopup(false);
    setshowNoAcessPopup(false);
    navigate("/"); // Navigate to LoginPage.jsx
  };
  const handleSearch = async (value) => {
    if (value.trim() == "") {
      setsearchProducts(products);
      setView("view");
      return;
    }

    try {
      const data = await searchProducts(value);
      console.log("after search recived data", data);
      setsearchProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
      handleUnauthorized(error);

      // Add a generic error message for other errors
      if (error.message !== "SESSION_EXPIRED_LOGOUT") {
        // Avoid showing error if the interceptor is handling the full logout
        setError(error.message || "Failed to load data.");
      }
    }
  };
  const fetchFilteredProducts = async () => {
    try {
      const data = await filterFetchProducts(statusFilter, priceFilter);
      setFilterProducts(data);
      setView("filter");
    } catch (err) {
      handleUnauthorized(error);

      // Add a generic error message for other errors
      if (error.message !== "SESSION_EXPIRED_LOGOUT") {
        // Avoid showing error if the interceptor is handling the full logout
        setError(error.message || "Failed to load data.");
      }
      console.error("Error fetching filtered products", err);
    }
  };

  useEffect(() => {
    if (view === "view") {
      fetchProducts();
    }
  }, [view]);
  useEffect(() => {
    console.log("Profile pic:", keycloak?.tokenParsed?.picture);
    if (keycloak?.tokenParsed?.picture) {
      setProfilePic(keycloak.tokenParsed.picture); // ✅ update state
    }
  }, [keycloak]); // run when keycloak changes
  // 1. Retrieve the user role from local storage on component mount
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all products?"
    );
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
  // Left side of the Navbar: Sidebar button and Brand Name
const leftContents = (
    <React.Fragment>
        {/* 1. Hamburger Button (replaces Bootstrap button) */}
        <Button
            icon="pi pi-bars" // Use a PrimeIcon for the hamburger
            className="p-button-secondary p-button-text me-3" // PrimeReact styling
            onClick={() => setSidebarOpen(true)}
            style={{ width: "55px", height: "55px" }} // Keep your custom size if needed
        />
        {/* 2. Brand Name */}
        <span className="p-text-bold text-xl">Product Management</span>
        
        {/* 3. Welcome Message (moved to center/right for spacing) */}
        {/* Note: The welcome message is often better suited for the right side or center */}
    </React.Fragment>
);
// 2. Determine if the user is an admin
const isAdmin = userRole === 'admin';
const middleContents=(
  <React.Fragment>
    {/* 1. Welcome Message */}
        <span className="mx-auto text-white fw-bold me-4">
            {keycloak?.tokenParsed?.name || keycloak?.tokenParsed?.preferred_username ? 
                `Welcome, ${keycloak.tokenParsed.name || keycloak.tokenParsed.preferred_username}` : ""}
        </span>
        
  </React.Fragment>
)
// Right side of the Navbar: Navigation Buttons, Search, and Profile
const rightContents = (
    <React.Fragment>   
      {/* 2. View Products Button (replaces Bootstrap button) */}
        <Button
            label="View Products"
            icon="pi pi-box" 
            // Use PrimeReact severity and class for active state
            className={`p-button-success p-button-outlined me-2 ${view === "view" ? "p-button-text" : ""}`}
            onClick={() => setView("view")}
        />
        {/* Conditionally render the button based on the role */}
            {isAdmin && (
                <Button
                    label="Add Product"
                    icon="pi pi-plus-circle"
                    className={`p-button-warning p-button-outlined me-2 ${view === "add" ? "p-button-text" : ""}`}
                    onClick={() => setView("add")}
                />
            )}
        
        {/* 4. View Cart Button (Note: Badge handling needs custom rendering in Toolbar) */}
        <Button
            label="View Cart"
            icon="pi pi-shopping-cart"
            className={`p-button-primary p-button-outlined me-4 ${view === "cart" ? "p-button-text" : ""}`}
            onClick={() => setView("cart")}
        >
            {/* The Badge: Requires wrapping in a span or custom element */}
            {cartItems.length > 0 && (
                <span className="p-badge p-badge-danger ms-1">{cartItems.length}</span>
            )}
        </Button>            
        {/* 5. Search Input (replaces form-control) */}
        <span className="p-input-icon-left me-4">
            <i className="pi pi-search" />
            <InputText
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    handleSearch(e.target.value);
                    setView("search");
                }}
                placeholder="Search products..."
                // Apply styling to match size if necessary
                className="p-inputtext-sm" 
            />
        </span>
        
        {/* 6. Profile Picture (Keep as <img>, use PrimeFlex for styling) */}
        {profilePic && (
            <img
                src={profilePic}
                alt="Profile"
                className="border-circle ms-3" // PrimeFlex/CSS class for rounded circle
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
        )}
    </React.Fragment>
);

  return (
    <div className="home-page">
      {/* Navbar */}
      <Toolbar
    start={leftContents}
    center={middleContents}
    end={rightContents}
    // You can apply a custom class for styling the background
    className="bg-dark text-white p-2" 
/>
      <SidebarComponent
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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


      <div className="container mt-4">
        {view === "view" ? (
          <ProductList
            products={products}
            loading={loading}
            error={error}
            fetchProducts={fetchProducts}
            highlightProduct={highlightProduct} 
          />
        ) : view === "add" ? (
          <ProductForm setProducts={setProducts} setView={setView} />
        ) : view === "search" ? (
          <ProductList
            products={searchProducts}
            loading={loading}
            error={error}
            fetchProducts={fetchProducts}
            highlightProduct={highlightProduct} 
          />
        ) : view === "filter" ? (
          <ProductList
            products={filterProducts}
            loading={loading}
            error={error}
            fetchProducts={fetchProducts}
            highlightProduct={highlightProduct} 
          />
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
      <ChatBot/>
    </div>
  );
};
export default HomePage;
