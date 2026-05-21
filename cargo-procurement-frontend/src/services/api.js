import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://cargo-backend-fut3.onrender.com";

export const API_URL = `${BASE_URL}/api`;
export const FILE_URL = BASE_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(err);
  },
);

export default api;
