import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['chart.js', 'react-chartjs-2'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
