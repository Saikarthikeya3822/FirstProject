import React, { useState } from "react";
import { saveProduct } from "../service/productService";
import "../styles/ProductsForm.css";

const ProductForm = ({ fetchProducts, setView }) => {
  const [prodname, setprodname] = useState("");
  const [price, setPrice] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    console.log("In handleImage change:", e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!prodname || !price || !creationDate || !image || !description) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const product = {
        prodname,
        category,
        price: parseFloat(price), // Convert price to a number
        creationDate: new Date(creationDate).toISOString(), // Convert to ISO string
        isActive,
        description
      };
      console.log("prduct before sending :", product); // Ensure it's a File object
      console.log("Submitting file:", image); // Ensure it's a File object
      await saveProduct(product, image); // Save product to the backend
      alert("Product saved successfully.");
      //fetchProducts(); // Refresh the product list
      setView("view"); // Switch back to the "View Products" view
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    }
  };

  return (
    <div className="product-form-container">
      <h3 className="text-center mb-4">Add Product</h3>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={prodname}
            onChange={(e) => setprodname(e.target.value)}
            required
          />
        </div>
        {/* Category Dropdown */}
        <div className="form-group">
          <label>Category</label>

          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Watch">Watch</option>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Creation Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label className="form-check-label">Is Active</label>
        </div>
        <div className="mb-3">
          <label>Description</label>

          <textarea
            className="form-control"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="Preview" className="preview-image" />
          )}
        </div>
        {error && <p className="text-danger">{error}</p>}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setView("view")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
