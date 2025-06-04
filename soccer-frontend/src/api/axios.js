import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, //For auth
});

const publicPaths = [
  "/api/players",
  "/api/teams",
  "/api/league",
  "/api/fixtures",
  "/api/news",
  "/api/products",
];

// Attach latest token before every request
api.interceptors.request.use(
  (config) => {
  const isPublic =
  config.method === "get" &&
  publicPaths.some((prefix) => config.url.startsWith(prefix + "/") || config.url === prefix);
    if (!isPublic) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const currentPath = window.location.pathname;

      if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
