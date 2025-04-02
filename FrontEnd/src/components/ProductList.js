import React, { useState } from "react";
//import { handleDelete, handleUpdate } from "./productService";
import { handleDelete,handleUpdate } from "../service/productService";


const ProductList = ({ products, setProducts, loading, error,fetchProducts }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    price: "",
    status: true,
    image:null,

  });

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditProductId(product.prodId);
    setEditedProduct({
      name: product.prodName,
      price: product.price,
      status: product.isActive,
      image: product.imageData
      ? { data: product.imageData, type: product.imageType || "image/jpeg" }
      : null, 
    });
  };
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value, // Ensure price is a number
    }));
  };

  // Handle status toggle
  const handleStatusChange = (e) => {
    setEditedProduct((prev) => ({
      ...prev,
      status: e.target.value === "true", // Convert string to boolean
    }));
  };
  // Handle image file change
const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setEditedProduct({
      ...editedProduct,
      image: e.target.files[0]
    });
  }
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
                { <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mb-2"/>}
{/* Image preview component with proper null handling */}
{editedProduct.image && (
  <img 
    src={
      editedProduct.image instanceof File 
        ? URL.createObjectURL(editedProduct.image) 
        : `data:${editedProduct.image.type || 'image/jpeg'};base64,${editedProduct.image.data}`
    } 
    alt="Product preview" 
    className="mt-2 w-full h-40 object-cover"
    style={{ width: "200px", height: "200px" }}
  />
)}

  
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{product.prodName}</h5>
                      <p className="card-text">
                        <strong>Price:</strong> ${product.price}
                      </p>
                      <p className="card-text">
                        <strong>Status:</strong>{" "}
                        {product.isActive ? "Active" : "Inactive"}
                      </p>
               {/* Display product image */}
    {product.imageData && (
      <img
        src={`data:${product.imageType};base64,${product.imageData}`}
        alt={product.prodName}
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
