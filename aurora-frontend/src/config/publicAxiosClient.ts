import axios from "axios";

// Public axios instance without authentication
// Use this for endpoints that don't require login (e.g., guest booking lookup)
const publicAxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: false, // No cookies for public requests
});

// No interceptors needed for public client
// Backend should handle these endpoints without authentication

export default publicAxiosClient;
