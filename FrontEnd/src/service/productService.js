import axios from "axios";
import api from "../Utils/api.js";

const API_BASE_URL = "http://localhost:8080";

const UPDATE_URL = `${API_BASE_URL}/updateproductbyid`;
const DELETE_BY_ID_URL = `${API_BASE_URL}/deleteproductbyid`;

// ===================== Register =====================
export const registerUser = async (userData) => {
  console.log("Data:", userData, JSON.stringify(userData));

  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  console.log("Response is:", response);

  if (response.status === 409) {
    const error = await response.json();
    throw new Error(error.message || "User already exists.");
  } else if (response.status === 500) {
    throw new Error("Registration failed due to server error.");
  }

  return response.json();
};

// ===================== Cart =====================
export const fetchCartItems = async () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");

  const res = await axios.get(`${API_BASE_URL}/cart/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Cart data from service:", res);
  return res.data;
};

// ===================== Filter =====================
export const filterFetchProducts = async (status, price) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_BASE_URL}/products/filter`, {
    params: { status, price },
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// ===================== Get All =====================
export const getProducts = async () => {
  const response = await api.get("/products/getproducts");
  console.log("products from db is :", response.data);
  return response.data;
};
// ===================== Get One =====================
export const getProductById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`http://localhost:8080/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ===================== Save Product =====================
export const saveProduct = async (product, image) => {
  const formData = new FormData();
  console.log("The image is :", image);
  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" }),
  );
  formData.append("imageFile", image);

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/products/addproduct`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to save product.");
  }

  return response.json();
};

// ===================== Delete All =====================
export const deleteAllProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/deleteallproducts`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete all products.");
  }
};

// ===================== Delete by ID =====================
export const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${DELETE_BY_ID_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200 || response.status === 204) {
      alert("Product deleted successfully!");
    } else {
      throw new Error("Delete failed");
    }
  } catch (error) {
    alert("Failed to delete product.");
  }
};

// ===================== Update =====================
export const handleUpdate = async (id, updatedProduct) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${UPDATE_URL}/${id}`,
      {
        prodName: updatedProduct.name,
        price: updatedProduct.price,
        isActive: updatedProduct.status,
        creationDate: updatedProduct.creationDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ===================== Add Cart =====================
export const addCart = async (cartItem) => {
  const token = localStorage.getItem("token");

  return axios.post(`${API_BASE_URL}/cart/addCart`, cartItem, {
    headers: {
      contentType: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===================== Orders =====================
export const addOrder = async (order) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_BASE_URL}/orders/addOrder`, order, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllOrderProducts = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
export const getOrders = (page, size) => {
  const token = localStorage.getItem("token");
  return api.get(`/orders?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getFilterChildren = async (filterType) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API_BASE_URL}/orders/filter-values?type=${filterType}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
export const getAllOrders = (page, size, filterType, filterValue) => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/orders`, {
    params: {
      page,
      size,
      filterType,
      filterValue,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getAllTrackers = (page, size, filterType, filterValue) => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/trackers`, {
    params: {
      page,
      size,
      filterType,
      filterValue,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const analyzeProduct = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `http://localhost:8080/springai/analyze-product/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
export const getComparisonOptions = async (productId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `http://localhost:8080/products/comparison-options/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
export const getUserAnalytics = async (userId, days = 30) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_BASE_URL}/activities/users/${userId}/analytics?days=${days}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
export const getUserInsights = async (userId) => {

    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_BASE_URL}/springai/user-insights/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};
