import axios from "axios";

const api = axios.create({ baseURL: "/" }); // MSW intercepts these

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("buyzzie_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
