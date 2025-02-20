import axios from "axios";

// Get the token from localStorage or state management
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ensure the latest token is used
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
