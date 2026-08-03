import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_SERVERAPI || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while loading data.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
