import axios from "axios";
const UPDATE_URL = "http://localhost:8080/updateproductbyid";
const DELETE_BY_ID_URL = "http://localhost:8080/deleteproductbyid";

export const registerUser = async (userData) => {
  console.log("Data:",userData,JSON.stringify(userData));
  const response = await fetch("http://localhost:8080/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  console.log("Response is:",response);
  if (response.status===409) {
    console.log("Inside 409 status");
    const error =  response.json(); // extract error message
    throw new Error(error.message || "User already exists.");
  }
  else if(response.status===500){
    throw new Error("Registration failed due to a server error in Keycloak Authentication. Please try again later.");
  }
  return  response.json();//response.json(); // return saved user
};
export const fetchCartItems = async () => {
  const token = localStorage.getItem("token");
  const id=localStorage.getItem("userId");
  console.log("token in cart:",token);
  console.log("id is",id)
  const res = await axios.get(`http://localhost:8080/cart/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
    console.log("data from cart table",res.data);
    return res.data;
};
//Filter Function
export const filterFetchProducts = async (status, price) => {
  debugger
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:8080/products/filter", {
    params: { status, price },   // 🔑 axios handles query params cleanly
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Inside filterFetchProducts data:",response.data)
  return response.data; // return, don’t set state here
};


export const getProducts  = async () => {
  const token = localStorage.getItem("token");
  console.log("token",token)
    const response = await axios.get("http://localhost:8080/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};

export const saveProduct = async (product,image) => {
    const formData = new FormData();
    
    // Append the JSON product object as a Blob
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    
    // Append the image file
    formData.append("imageFile", image);
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    const response = await fetch("http://localhost:8080/addproduct", {
        method: "POST",
        body: formData, // Do NOT set Content-Type, fetch will handle it
        headers: {
          "Accept": "application/json", // Do NOT set Content-Type manually
          "Authorization": `Bearer ${token}` // Add Bearer token
      }
    });

    if (!response.ok) {
        throw new Error("Failed to save product.");
    }

    return response.json();
};

export const addCart = async (formData) => {
  const token = localStorage.getItem("token"); // make sure your token key matches

  return axios.post("http://localhost:8080/cart/addCart", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    }
  });
};



  
  export const deleteAllProducts = async () => {
    const token = localStorage.getItem("token"); // Or wherever your JWT is stored
    const response = await fetch("http://localhost:8080/deleteallproducts", {
      headers: {
      "Authorization": `Bearer ${token}`, // Send token in Authorization header
    },
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
      const token = localStorage.getItem("token"); // Or wherever your JWT is stored
      const response = await axios.delete(`${DELETE_BY_ID_URL}/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
    },
  });
      
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
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await axios.put(`${UPDATE_URL}/${id}`, {
            prodName: updatedProduct.name,
            price: updatedProduct.price,
            isActive: updatedProduct.status,
            creationDate:updatedProduct.creationDate,

        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        // Handle successful response
        return response.data;       
    }  catch (error) {
      //console.error(new Error('Whoops, something bad happened'));
    }
  };



