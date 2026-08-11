import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add interceptors if needed for error handling globally
api.interceptors.response.use(
    response => response,
    error => {
        // Handle common errors like 401 Unauthorized etc if they exist
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
