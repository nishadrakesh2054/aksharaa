import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("ckeditor5") || id.includes("@ckeditor")) return "editor-vendor";
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
            return "react-vendor";
          }
          if (id.includes("lucide-react")) return "icons-vendor";
          if (id.includes("@reduxjs") || id.includes("react-redux")) return "state-vendor";
          if (id.includes("axios") || id.includes("dompurify") || id.includes("react-hot-toast")) {
            return "app-vendor";
          }
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
