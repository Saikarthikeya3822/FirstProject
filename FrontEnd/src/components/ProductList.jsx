import React, { useState } from "react";
import { handleDelete, handleUpdate } from "../service/productService";

const ProductList = ({
  products,
  setProducts,
  loading,
  error,
  fetchProducts,
}) => {
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    price: "",
    status: true,
  });

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditProductId(product.prodid);
    setEditedProduct({
      name: product.prodname, // ✅ fixed
      price: product.price,
      status: product.isActive, // ✅ fixed
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle status toggle
  const handleStatusChange = (e) => {
    setEditedProduct((prev) => ({
      ...prev,
      status: e.target.value === "true",
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
    setEditProductId(null);
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
          {products.map((product) => {
            return (
              <div key={product.prodid} className="col-md-4 mb-3">
                <div className="card shadow-sm">
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
                      </>
                    ) : (
                      <>
                        {/* ✅ FIXED FIELD NAME */}
                        <h5 className="card-title">{product.prodname}</h5>

                        {/* ✅ IMAGE DISPLAY */}
                        {product.imageUrl && (
                          <img
                            src={`http://localhost:808${product.imageUrl}`}
                            alt={product.prodname}
                            style={{ width: "200px" }}
                          />
                        )}

                        <p className="card-text">
                          <strong>Price:</strong> ${product.price}
                        </p>

                        <p className="card-text">
                          <strong>Status:</strong>{" "}
                          {product.isActive ? "Active" : "Inactive"}
                        </p>
                      </>
                    )}

                    {editProductId === product.prodid ? (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleSaveClick(product.prodid)}
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
                      onClick={() => handleDeleteClick(product.prodid)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted">No products available</p>
      )}
    </div>
  );
};

export default ProductList;
