import React, { useState, useEffect } from "react";
//mport { handleDelete, handleUpdate, } from "./productService";
import { handleDelete, handleUpdate, addCart, fetchCartItems } from "../service/productService";
import useUnauthorizedHandler from "./UnauthorizedHandler";
import SessionPopup from "./SessionPopup";

const ProductList = ({ products, setProducts, loading, error, fetchProducts }) => {

  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
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

  useEffect(()=>{
    debugger
    if (currentPage > Math.ceil(totalPosts / postsPerPage)) {
      setCurrentPage(Math.ceil(totalPosts / postsPerPage) || 1); // fallback to 1 if no pages
    }
  },[totalPosts])

  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    // setCurrentPage(1);
    pages.push(i);
  }
  console.log('pages inside the productjs',pages);
  // Handle edit button click
  const handleEditClick = (product) => {
    setEditProductId(product.prodId);
    setEditedProduct({
      name: product.prodName,
      price: product.price,
      status: product.isActive,
      creationDate: product.creationDate,
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
  }
  // Handle save after editing
  const handleSaveClick = async (id) => {
    await handleUpdate(id, editedProduct, setProducts);
    fetchProducts();
    setEditProductId(null); // Exit edit mode
  };
  const handleAddToCart = async (product) => {
    const Id = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    try {
      const cartItem = {
        userId: Id,
        username: name,
        prodId: product.prodId,
        prodName: product.prodName,
        price: product.price,
        imageName: product.imageName,
        imageType: product.imageType
      };
      // 2. Create FormData
      const formData = new FormData();

      // Append cart as JSON blob
      formData.append(
        "cart",
        new Blob([JSON.stringify(cartItem)], { type: "application/json" })
      );

      // Append image as file (convert Base64 → Blob)
      if (product.imageData && product.imageType) {
        const byteString = atob(product.imageData);
        const uint8Array = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
        const imageBlob = new Blob([uint8Array], { type: product.imageType });
        formData.append("imageFile", imageBlob, product.imageName);
      }
      addCart(formData);
      alert("Product saved successfully.");
      setCartItems(prev => [...prev, product]);
      //setAdded(true);
    }
    catch (error) {
      console.log("Error while adding cart");
      alert("Failed to save product. Please try again.");
    }

  };
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
        <p className="text-center text-danger">{error}</p>)
        : products.length > 0 ? (
          <div className="row">
            {currentPosts.map((product) => (
              <div key={product.prodId} className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    {editProductId === product.prodId ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={editedProduct.name}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                        />

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
                          value={editedProduct.creationDate ? new Date(editedProduct.creationDate).toISOString().slice(0, 16) : ""}
                          onChange={handleInputChange}
                          className="form-control mb-2"
                        />
                      </>
                    ) : (
                      <>
                        <h5 className="card-title">{product.prodName}</h5>
                        <p className="card-text">
                          <strong>Price:</strong> ${product.price}
                        </p>
                        <p className="card-text">
                          <strong>Status:</strong>{" "}
                          {product.isActive === "true" || product.isActive === true ? "Active" : "Inactive"}
                        </p>
                        <p className="card-text">
                          <strong>CreationDate:</strong> {product.creationDate}
                        </p>

                        {product.imageData && (
                          <div className="mb-3">
                            <img
                              src={`data:${product.imageType};base64,${product.imageData}`}
                              alt={product.name}
                              className="product-image"
                            />
                          </div>)}
                        {/* Add to Cart Button */}
                        {
                          <button
                            disabled={CartItems.some(item => item.prodId === product.prodId)} onClick={() => {
                              if (!CartItems.some(item => item.prodId === product.prodId)) {
                                handleAddToCart(product);
                              }
                            }}>
                            {CartItems.some(item => item.prodId === product.prodId)
                              ? "Already in cart"
                              : "Add to cart"}
                          </button>
                        }

                      </>
                    )}

                    {editProductId === product.prodId ? (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleSaveClick(product.prodId)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(product.prodId, setProducts)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className='pagination'>
              {pages.map((page, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={page == currentPage ? "active" : ""}>
                    {page}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">No products available</p>
        )
      }
      {/* ✅ Reusable Popups */}
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

export default ProductList;
