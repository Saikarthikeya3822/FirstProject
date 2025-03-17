import axios from "axios";
const UPDATE_URL = "http://localhost:8080/updateproductbyid";
const DELETE_BY_ID_URL = "http://localhost:8080/deleteproductbyid";
export const getProducts = async () => {
    const response = await fetch("http://localhost:8080/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    return response.json();
  };
  
  export const saveProduct = async (product,image) => {
    const formData = new FormData();
    
    // Append the JSON product object as a Blob
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    
    // Append the image file
    formData.append("imageFile", image);

    const response = await fetch("http://localhost:8080/addproduct", {
        method: "POST",
        body: formData, // Do NOT set Content-Type, fetch will handle it
        headers: {
          "Accept": "application/json" // Do NOT set Content-Type manually
      }
    });

    if (!response.ok) {
        throw new Error("Failed to save product.");
    }

    return response.json();
};


  
  export const deleteAllProducts = async () => {
    const response = await fetch("http://localhost:8080/deleteallproducts", {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete all products.");
    }
  };
  // Function to delete a product by ID
  export const handleDelete = async (id, setProducts) => {
    // debugger
    try {
      const response = await axios.delete(`${DELETE_BY_ID_URL}/${id}`);
      
      // ✅ Check if deletion was actually successful
      if (response.status === 200 || response.status === 204) {
        console.log("Deleted product ID:", id);
        alert("Product deleted successfully!");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };
  

  // Function to update a product by ID
  export const handleUpdate = async (id, updatedProduct, setProducts) => {
    try {
      const response = await axios.put(`${UPDATE_URL}/${id}`, {
        prodName: updatedProduct.name,
        price: updatedProduct.price,
        isActive: updatedProduct.status,
      });
    } catch (error) {
      //console.error(new Error('Whoops, something bad happened'));
    }
  };