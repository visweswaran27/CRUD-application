import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change this to your preferred development port
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Ensure compatibility with older browsers
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  define: {
    // To avoid warnings/errors during production builds
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
