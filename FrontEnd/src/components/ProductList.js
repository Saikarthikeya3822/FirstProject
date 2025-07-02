import React, { useState } from "react";
//import { handleDelete, handleUpdate } from "./productService";
import { handleDelete,handleUpdate } from "../service/productService";


const ProductList = ({ products, setProducts, loading, error,fetchProducts }) => {
  // console.log("isActive value:", products.isActive);
  // console.log("isActive type:", typeof products.isActive);
  console.log("products", products);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    price: "",
    status: true,
    creationDate:"",
  });

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditProductId(product.prodId);
    setEditedProduct({
      name: product.prodName,
      price: product.price,
      status: product.isActive,
      creationDate:product.creationDate,
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

  const handleDeleteClick=async(id)=>{
    await handleDelete(id,setProducts);
    fetchProducts();
  }
  // Handle save after editing
  const handleSaveClick = async (id) => {
    await handleUpdate(id, editedProduct, setProducts);
    fetchProducts();
    setEditProductId(null); // Exit edit mode
  };
  return (
    <div>
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
          {products.map((product) => (
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
                    <img
                    src={`data:${product.imageType};base64,${product.imageData}`}
                    alt={product.name}
                  className="product-image"
            />
                  )}
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
        </div>
      ) : (
        <p className="text-center text-muted">No products available</p>
      )}
    </div>
  );
};

export default ProductList;
