import { API_BASE_URL } from "./client";

export const getFileUrl = (path, fallback = "/fallbackimage.avif") => {
  if (!path) return fallback;
  if (Array.isArray(path)) return getFileUrl(path[0], fallback);
  if (typeof path !== "string") return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  if (path.startsWith("/fallback") || path.startsWith("/static") || path.startsWith("/assets")) {
    return path;
  }
  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
};

export const firstImage = (value, fallback = "/fallbackimage.avif") => {
  if (Array.isArray(value)) return getFileUrl(value[0], fallback);
  return getFileUrl(value, fallback);
};

