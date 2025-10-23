import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  async function (config) {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return Promise.reject(error);
  }
);

export default instance;
