import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProducts,deleteAllProducts,fetchCartItems } from "./service/productService";
import './styles/HomePage.css';
import { useNavigate,useLocation } from "react-router-dom";
import './styles/Pagination.css';
import useUnauthorizedHandler from "./components/UnauthorizedHandler";
import SessionPopup from "./components/SessionPopup";
import CartList from "./components/CartList";

const HomePage = () => {
  const [view, setView] = useState("view");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
  const[showNoAcessPopup,setshowNoAcessPopup]=useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [profilePic, setProfilePic] = useState(null);
  const [cartItems, setCartItems] = useState([]);

    const handleOkClick = () => {
    debugger
    console.log("Inside  handleOkClick");
    setShowSessionExpiredPopup(false);
    setshowNoAcessPopup(false);
    navigate("/"); // Navigate to LoginPage.jsx
  };

 useEffect(() => {
  console.log("Inside the Use effect");
  const params = new URLSearchParams(location.search);
  console.log("params:",params);
  const token = params.get("token");
  console.log("token from param:",token);
  console.log("token from local storage:",localStorage.getItem("token"));
  const picture = params.get("picture");
  if(token && picture){
    localStorage.setItem("token", token);
    setProfilePic(decodeURIComponent(picture));
  }
  if(!localStorage.getItem("token")){
    handleUnauthorized();
  }
  if (view === "view") {
    fetchProducts();
  }
}, [view, location]);

  // Fetch products from the backend
  const fetchProducts = async () => {
    // debugger
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      const  cartData=await fetchCartItems();
      setCartItems(cartData);

    } catch (error) {
     handleUnauthorized();
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
          <span className="navbar-brand">Product Management</span>
          <div className="navbar-nav">
            {/* View Products */}
      <button
      className={`btn btn-outline-success position-relative me-2 ${view === "view" ? "active" : ""}`}
      onClick={() => setView("view")}
      >
      <i className="bi bi-box-seam me-1"></i> {/* Product icon */}
      View Products
        </button>
          {/* Add Product */}
          <button
          className={`btn btn-outline-warning position-relative ${view === "add" ? "active" : ""}`}
          onClick={() => setView("add")}
          >
            <i className="bi bi-plus-circle me-1"></i> {/* Add icon */}
              Add Product
            </button>
            <button
            className={`btn btn-outline-primary position-relative ${view === "cart" ? "active" : ""}`}
            onClick={() => setView("cart")}
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
             {profilePic && (
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-circle ms-3"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        )}            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        {view === "view" ? (
          <ProductList products={products} loading={loading} error={error} fetchProducts={fetchProducts}/>
        ) : view === "add" ? (
          <ProductForm setProducts={setProducts} setView={setView} />
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