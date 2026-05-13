import axios from "axios";
import { getApiBaseUrl } from "@/config/api";

// Public axios instance without authentication
// Use this for endpoints that don't require login (e.g., guest booking lookup)
const publicAxiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: false, // No cookies for public requests
});

// No interceptors needed for public client
// Backend should handle these endpoints without authentication

export default publicAxiosClient;
