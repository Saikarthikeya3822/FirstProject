import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import keycloak from "./keycloak";
import {
  handleDelete,
  handleUpdate,
  addCart,
  fetchCartItems,
} from "../service/productService";
import useUnauthorizedHandler from "./UnauthorizedHandler";
import SessionPopup from "./SessionPopup";
import { addOrder, trackActivity } from "../service/productService";
const ProductList = ({
  products,
  setProducts,
  loading,
  error,
  fetchProducts,
  highlightProduct,
}) => {
  const navigate = useNavigate();
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    category: "",
    price: "",
    status: true,
    creationDate: "",
  });
  const [added, setAdded] = useState(false);
  const [CartItems, setCartItems] = useState([]);
  const {
    showSessionExpiredPopup,
    setShowSessionExpiredPopup,
    showNoAccessPopup,
    setShowNoAccessPopup,
    handleUnauthorized,
  } = useUnauthorizedHandler();
  //const[error,setError]=useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(2);

  const totalPosts = products.length;
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = products.slice(firstPostIndex, lastPostIndex);

  const loadCartItems = async () => {
    try {
      const data = await fetchCartItems();
      console.log("cart data got", data);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      handleUnauthorized();
      //alert("Error while getting products");
    }
  };
  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    if (currentPage > Math.ceil(totalPosts / postsPerPage)) {
      setCurrentPage(Math.ceil(totalPosts / postsPerPage) || 1); // fallback to 1 if no pages
    }
  }, [totalPosts]);

  const highlightRef = useRef(null);

  // 🔥 Auto scroll when highlight changes
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightProduct]);

  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    // setCurrentPage(1);
    pages.push(i);
  }
  console.log("pages inside the productjs", pages);

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditProductId(product.prodid);
    setEditedProduct({
      name: product.prodname,
      price: product.price,
      status: product.isActive,
      creationDate: product.creationDate,
      description: product.description,
    });
  };
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "price") {
      processedValue = parseFloat(value) || 0;
    } else if (name === "creationDate" && value) {
      const date = new Date(value);
      if (!isNaN(date)) {
        processedValue = date.toISOString();
      } else {
        console.warn("Invalid date value from input:", value);
        processedValue = null;
      }
    }
    setEditedProduct((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Handle status toggle
  const handleStatusChange = (e) => {
    setEditedProduct((prev) => ({
      ...prev,
      status: e.target.value === "true", // Convert string to boolean
    }));
  };

  const handleDeleteClick = async (id) => {
    await handleDelete(id, setProducts);
    fetchProducts();
  };
  // Handle save after editing
  const handleSaveClick = async (id) => {
    await handleUpdate(id, editedProduct, setProducts);
    fetchProducts();
    setEditProductId(null); // Exit edit mode
  };
  const trackCartActivity = async (id) => {
    try {
      await trackActivity({
        userId: localStorage.getItem("userId"),
        productId: id,
        activityType: "ADD_TO_CART",
        metadata: "Product Added to Cart",
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddToCart = async (product) => {
    const Id = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    try {
      const cartItem = {
        userid: Id,
        prodid: product.prodid,
        quantity: 1,
      };
      console.log("Adding to cart:", cartItem);
      addCart(cartItem);     
      alert("Product saved successfully.");
      setCartItems((prev) => [...prev, product]);
      trackCartActivity(product.prodid);
    } catch (error) {
      console.log("Error while adding cart");
      alert("Failed to save product. Please try again.");
    }
  };
  const popupRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // --- State & District Data ---
  const stateDistrictData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur"],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  };

  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // --- When user selects a state ---
  const handleStateChange = (e) => {
    const state = e.value;
    setSelectedState(state);
    setDistricts(stateDistrictData[state] || []);
    setSelectedDistrict(""); // reset previous district
  };
 const trackOrderActivity = async (id) => {
    try {
      await trackActivity({
        userId: localStorage.getItem("userId"),
        productId: id,
        activityType: "PURCHASE_PRODUCT",
        metadata: "Order Placed",
      });
    } catch (error) {
      console.error(error);
    }
  };
  // --- OrderConfirm button logic ---
  const handleConfirm = async () => {
    try {
      if (!selectedState || !selectedDistrict) {
        alert("Please select both State and District!");
        return;
      }

      const orderData = {
        prodId: selectedProduct.prodid,
        productname: selectedProduct.prodname,
        category: selectedProduct.category,
        state: selectedState,
        username: keycloak.tokenParsed.name,
        region: selectedDistrict,
        price: selectedProduct.price,
        status: "Created",
      };

      const response = await addOrder(orderData);
      console.log("Response from orders:", response);
      trackOrderActivity(selectedProduct.prodid);
      alert(`Order placed successfully! Order ID: ${response}`);
      
      setVisible(false);
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };
  console.log("Highlighted product in ProuctList.js", highlightProduct);
  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Product List</h3>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : products.length > 0 ? (
        <div className="row">
          {/* 🔥 FIXED MAP BLOCK */}
          {currentPosts.map((product) => {
            // ✅ highlight logic (correct place)
            const isHighlighted =
              highlightProduct &&
              product.prodname
                ?.toLowerCase()
                .includes(highlightProduct.toLowerCase());
            console.log("Comparing:", product.prodname, highlightProduct);

            return (
              <div
                key={product.prodid}
                className="col-md-4 mb-3"
                ref={isHighlighted ? highlightRef : null}
              >
                <div
                  className={`card shadow-sm ${
                    isHighlighted ? "border border-warning border-3" : ""
                  }`}
                >
                  <div className="card-body">
                    {editProductId === product.prodid ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={editedProduct.name}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                        />
                        {/* Category Dropdown */}
                        <select
                          name="category"
                          value={editedProduct.category}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                        >
                          <option value="">Select Category</option>
                          <option value="Watch">Watch</option>
                          <option value="Laptop">Laptop</option>
                          <option value="Mobile">Mobile</option>
                        </select>
                        <input
                          type="number"
                          name="price"
                          value={editedProduct.price}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                        />

                        <select
                          name="status"
                          value={editedProduct.status}
                          onChange={handleStatusChange}
                          className="form-control mb-2"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>

                        <input
                          type="datetime-local"
                          name="creationDate"
                          value={
                            editedProduct.creationDate
                              ? new Date(editedProduct.creationDate)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={handleInputChange}
                          className="form-control mb-2"
                        />
                        <textarea
                          name="description"
                          value={editedProduct.description}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                          rows="3"
                        />
                      </>
                    ) : (
                      <>
                        <h5
                          className="card-title"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/product/${product.prodid}`)}
                        >
                          {product.prodname}
                        </h5>
                        <h5 className="card-title">{product.category}</h5>

                        <p className="card-text">
                          <strong>Price:</strong> ${product.price}
                        </p>

                        <p className="card-text">
                          <strong>Status:</strong>{" "}
                          {product.isActive === "true" ||
                          product.isActive === true
                            ? "Active"
                            : "Inactive"}
                        </p>

                        <p className="card-text">
                          <strong>CreationDate:</strong> {product.creationDate}
                        </p>

                        {product.imageUrl && (
                          <img
                            src={`http://localhost:8083${product.imageUrl}`}
                            alt={product.prodname}
                            className="product-image"
                          />
                        )}

                        <div className="d-flex gap-2 mb-2">
                          <button
                            className="btn btn-outline-dark btn-sm"
                            disabled={CartItems.some(
                              (item) => item.productId === product.prodid,
                            )}
                            onClick={() => {
                              if (
                                !CartItems.some(
                                  (item) => item.productId === product.prodid,
                                )
                              ) {
                                handleAddToCart(product);
                              }
                            }}
                          >
                            {CartItems.some(
                              (item) => item.productId === product.prodid,
                            )
                              ? "Already in cart"
                              : "Add to cart"}
                          </button>

                          <button
                            className="btn btn-warning text-white fw-bold px-3 rounded-pill"
                            style={{
                              backgroundColor: "#ff9800",
                              border: "none",
                            }}
                            onClick={() => {
                              setSelectedProduct(product);
                              setVisible(true);
                            }}
                          >
                            Order Now
                          </button>
                        </div>
                      </>
                    )}

                    <div className="d-flex gap-2">
                      {editProductId === product.prodid ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSaveClick(product.prodid)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditClick(product)}
                        >
                          Edit
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDeleteClick(product.prodid, setProducts)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* pagination stays same */}
          <div className="pagination">
            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={page == currentPage ? "active" : ""}
              >
                {page}
              </button>
            ))}
          </div>
          <Dialog
            header="Place Order"
            visible={visible}
            style={{ width: "30vw" }}
            onHide={() => setVisible(false)}
            modal
          >
            <div className="d-flex flex-column gap-3">
              {/* State Dropdown */}
              <div>
                <label className="fw-bold mb-2">Select State</label>

                <Dropdown
                  value={selectedState}
                  options={Object.keys(stateDistrictData)}
                  onChange={handleStateChange}
                  placeholder="Choose State"
                  className="w-100"
                />
              </div>

              {/* District Dropdown */}
              <div>
                <label className="fw-bold mb-2">Select District</label>

                <Dropdown
                  value={selectedDistrict}
                  options={districts}
                  onChange={(e) => setSelectedDistrict(e.value)}
                  placeholder="Choose District"
                  className="w-100"
                  disabled={!selectedState}
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setVisible(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-success" onClick={handleConfirm}>
                  OK
                </button>
              </div>
            </div>
          </Dialog>
        </div>
      ) : (
        <p className="text-center text-muted">No products available</p>
      )}
    </div>
  );
};

export default ProductList;
