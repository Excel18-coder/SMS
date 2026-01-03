import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiry and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle token expiry or invalid token
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: "network_error",
      });
    }

    return Promise.reject(error);
  }
);

// Auth helper functions
export const authHelpers = {
  saveAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default api;
