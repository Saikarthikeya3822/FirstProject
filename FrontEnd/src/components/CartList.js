import React, { useEffect, useState } from "react";
import { fetchCartItems } from "../service/productService";
import useUnauthorizedHandler from "./UnauthorizedHandler";

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    showSessionExpiredPopup,
    setShowSessionExpiredPopup,
    showNoAccessPopup,
    setShowNoAccessPopup,
    handleUnauthorized,
  } = useUnauthorizedHandler();

  // ✅ Fetch cart items from endpoint
  const loadCartItems = async () => {
      try {
        const data = await fetchCartItems();
        setCartItems(data);
      } catch (err) {
        setError("Failed to load cart items.");
        handleUnauthorized(err); 
        
        // Add a generic error message for other errors
        if (err.message !== "SESSION_EXPIRED_LOGOUT") {
           // Avoid showing error if the interceptor is handling the full logout
           setError(err.message || "Failed to load data."); 
        }
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    loadCartItems();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading cart...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  
    console.log("Cart data in cartlist.js",cartItems)
  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="row">
          {cartItems.map((item, index) => (
            <div key={index} className="col-md-12 mb-3">
              <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
                {/* Image */}
                <img
                 src={`http://localhost:8083${item.imageUrl}`}
                  alt={item.name}
                  className="rounded me-3"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />

                {/* Content */}
                <div className="flex-grow-1">
                  <h5 className="card-title">{item.productName}</h5>
                  {/* //<p className="card-text text-muted">{item.description}</p> */}
                  <p className="fw-bold">₹{item.quantity * item.price}</p>
                   <p className="fw-bold">Qty: {item.quantity || 1}</p>
                </div>
                {/* Remove Button */}
                <div className="text-end">
                 {/* //<p className="mb-2">Qty: {item.quantity || 1}</p> */}
                  <button className="btn btn-sm btn-danger">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartList;
