import axios from "axios";
import keycloak from "../components/keycloak";

// Create Axios instance
const api = axios.create({
  // Requests will go to:
  // Browser -> /api -> Nginx -> Gateway -> Microservices
  baseURL: "/api",
});

// ============================
// Request Interceptor
// ============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// Response Interceptor
// ============================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await keycloak.updateToken(5);

        if (refreshed) {
          console.log("🔑 Token refreshed. Retrying request...");

          localStorage.setItem("token", keycloak.token);

          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh Token expired.");

        localStorage.removeItem("token");

        window.location.href = "/";

        return Promise.reject(
          new Error("SESSION_EXPIRED_HARD_LOGOUT")
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;