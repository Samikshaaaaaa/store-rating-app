import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add new user (admin or normal)
export const addUser = (userData) => {
  return api.post("/admin/users", userData);
};

// Add new store
export const addStore = (storeData) => {
  return api.post("/admin/stores", storeData);
};

export default api;
