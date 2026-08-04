import axios from "axios";
import keycloak from "../components/keycloak";

// ===============================
// Axios Instance
// ===============================
const api = axios.create({
  // Browser -> /api -> Nginx -> API Gateway -> Microservices
  baseURL: "/api",
  timeout: 30000,
});

// ===============================
// Request Interceptor
// ===============================
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Response Interceptor
// ===============================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite retry loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh Keycloak token if expiring within 5 seconds
        await keycloak.updateToken(5);

        // Save new token
        localStorage.setItem("token", keycloak.token);

        // Retry request with refreshed token
        originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;

        return api(originalRequest);

      } catch (refreshError) {

        console.error("Session expired. Logging out...");

        localStorage.removeItem("token");

        keycloak.logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;