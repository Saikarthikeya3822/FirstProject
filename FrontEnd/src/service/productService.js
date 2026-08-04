import api from "../Utils/api";

// ===================== Register =====================
export const registerUser = async (userData) => {
  console.log("Data:", userData, JSON.stringify(userData));

  try {
    const response = await api.post("/register", userData);
    console.log("Response is:", response);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error(error.response?.data?.message || "User already exists.");
    }

    if (error.response?.status === 500) {
      throw new Error("Registration failed due to server error.");
    }

    throw error;
  }
};

// ===================== Cart =====================
export const fetchCartItems = async () => {
  const id = localStorage.getItem("userId");

  const res = await api.get(`/cart/${id}`);
  console.log("Cart data from service:", res);
  return res.data;
};

// ===================== Filter =====================
export const filterFetchProducts = async (status, price) => {
  const response = await api.get("/products/filter", {
    params: { status, price },
  });

  return response.data;
};

// ===================== Get All =====================
export const getProducts = async () => {
  const response = await api.get("/products/getproducts");
  console.log("products from db is :", response.data);
  return response.data;
};

export const searchProducts = async (keyword) => {
  const response = await api.get("/products/search", {
    params: { keyword },
  });

  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const trackActivity = async (payload) => {
  const response = await api.post("/activities", payload, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data;
};

export const compareProductsWithAI = async (product1, product2) => {
  const response = await api.post("/springai/products/compare", {
    product1,
    product2,
  });

  return response.data;
};

export const getProductAnalytics = async () => {
  const [dashboard, viewed, cart, purchased] = await Promise.all([
    api.get("/activities/dashboard"),
    api.get("/activities/top-viewed-products"),
    api.get("/activities/top-cart-products"),
    api.get("/activities/top-purchased-products"),
  ]);

  return {
    dashboard: dashboard.data,
    viewed: viewed.data,
    cart: cart.data,
    purchased: purchased.data,
  };
};

export const getChatHistory = async (conversationId) => {
  const response = await api.get(`/springai/chat/history/${conversationId}`);
  return response.data;
};

export const getChatConversations = async () => {
  const response = await api.get("/springai/chat/conversations");
  return response.data;
};

export const deleteChatConversation = async (conversationId) => {
  await api.delete(`/springai/chat/${conversationId}`);
};

export const sendChatMessage = async (message, conversationId) => {
  const response = await api.post("/springai/chat", {
    message,
    conversationId,
  });

  return response.data;
};
// ===================== Get One =====================
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

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

  const response = await api.post("/products/addproduct", formData, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data;
};

// ===================== Delete All =====================
export const deleteAllProducts = async () => {
  await api.delete("/deleteallproducts");
};

// ===================== Delete by ID =====================
export const handleDelete = async (id) => {
  try {
    const response = await api.delete(`/${id}`);

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
    const response = await api.put(
      `/${id}`,
      {
        prodName: updatedProduct.name,
        price: updatedProduct.price,
        isActive: updatedProduct.status,
        creationDate: updatedProduct.creationDate,
      },
      {
        headers: {
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
  return api.post(`/cart/addCart`, cartItem);
};

// ===================== Orders =====================
export const addOrder = async (order) => {
  const response = await api.post(`/orders/addOrder`, order);

  return response.data;
};

export const getAllOrderProducts = async () => {
  const res = await api.get("/orders");

  return res.data;
};
export const getOrders = (page, size) => {
  return api.get(`/orders?page=${page}&size=${size}`);
};
export const getFilterChildren = async (filterType) => {
  const res = await api.get(`/orders/filter-values?type=${filterType}`);

  return res.data;
};
export const getAllOrders = (page, size, filterType, filterValue) => {
  return api.get("/orders", {
    params: {
      page,
      size,
      filterType,
      filterValue,
    },
  });
};
export const getAllTrackers = (page, size, filterType, filterValue) => {
  return api.get("/trackers", {
    params: {
      page,
      size,
      filterType,
      filterValue,
    },
  });
};

export const analyzeProduct = async (id) => {
  const response = await api.post(`/springai/analyze-product/${id}`, {});

  return response.data;
};
export const getComparisonOptions = async (productId) => {
  const response = await api.get(`/products/comparison-options/${productId}`);

  return response.data;
};
export const getUserAnalytics = async (userId, days = 30) => {
  const response = await api.get(`/activities/users/${userId}/analytics?days=${days}`);

  return response.data;
};
export const getUserInsights = async (userId) => {
  const response = await api.get(`/springai/user-insights/${userId}`);

  return response.data;
};
