export const getImageUrl = (path, fallback = "/fallbackimage.avif") => {
  if (!path) return fallback;
  if (Array.isArray(path)) return getImageUrl(path[0], fallback);
  if (typeof path !== "string") return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  if (
    path.startsWith("/fallback") ||
    path.startsWith("/static") ||
    path.startsWith("/assets") ||
    path.startsWith("/chairman") ||
    path.startsWith("/round")
  ) {
    return path;
  }
  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  const serverApi = import.meta.env.VITE_SERVERAPI || "";
  return `${serverApi}/${cleanPath}`;
};

export default getImageUrl;
