import axios from "axios";
const UPDATE_URL = "http://localhost:8080/updateproductbyid";
const DELETE_BY_ID_URL = "http://localhost:8080/deleteproductbyid";

export const getProducts = async () => {
  const username = 'admin';
  const password = 'admin123';
  
  // const headers = new Headers();
  // headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
  // headers.append('Content-Type', 'application/json');
  // const base64Credentials = btoa(`${username}:${password}`);
  // console.log(base64Credentials);

  const response = await fetch("http://localhost:8080/products", {
    method: 'GET',
    headers:{
      'Authorization': `Basic ${btoa('admin:admin123')}`,
      'Content-Type': 'application/json'
  },
   mode: "no-cors" 
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch products. Status: ${response.status}, Message: ${errorText}`);
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
      const formData = new FormData();
  
      // Append product details as a JSON string
      const productData = JSON.stringify({
        prodName: updatedProduct.name,
        price: updatedProduct.price,
        isActive: updatedProduct.status,
      });
  
      formData.append("product", new Blob([productData], { type: "application/json" }));
  
      // Append the image file if it exists
      if (updatedProduct.image) {
        formData.append("imageFile", updatedProduct.image);
      }
  
      const response = await axios.put(`${UPDATE_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Optionally update state
      if (setProducts) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  