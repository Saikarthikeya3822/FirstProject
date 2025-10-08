import axios from 'axios';
import keycloak from '../components/keycloak'; 
// 1. Create a dedicated Axios instance
const api = axios.create({
    baseURL: "http://localhost:8080", // Your backend base URL
});

// 2. Request Interceptor (attaches token)
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. Response Interceptor (handles 401 and refresh)
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // 🚨 CRITICAL: If the error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token (5 seconds validity check)
                const refreshed = await keycloak.updateToken(5); 
                
                if (refreshed) {
                    console.log("🔑 Token refreshed after 401. Retrying request.");
                    
                    // Update localStorage with the new token
                    localStorage.setItem("token", keycloak.token);
                    
                    // Update the header for the failed request
                    originalRequest.headers['Authorization'] = `Bearer ${keycloak.token}`;
                    
                    // Retry the original request
                    return api(originalRequest); 
                }
            } catch (refreshError) {
                // 🛑 Refresh failed (Refresh Token is expired/invalid). True logout is needed.
                console.error("❌ Refresh Token expired or failed. Forcing logout.");
                
                // *** Perform the final logout steps ***
                console.log("Inside Refresh token");
                localStorage.removeItem("token");
                window.location.href = '/'; // Redirect to login page
                
                // Reject with a custom error to signal a hard logout if needed elsewhere
                return Promise.reject(new Error("SESSION_EXPIRED_HARD_LOGOUT"));
            }
        }
        
        // Handle the case where the refresh failed (already handled above) 
        // OR any other non-401 error.
        return Promise.reject(error);
    }
);

export default api;