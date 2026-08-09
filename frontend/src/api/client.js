import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_SERVERAPI || "").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const validationErrors = error.response?.data?.errors;
    const message =
      (Array.isArray(validationErrors) && validationErrors.length > 0
        ? validationErrors.map((err) => err.message).join(" ")
        : "") ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while loading data.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
