import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  server: {
    proxy: {
      "/api": {
        target: "http://server-nodejs.cit.byui.edu:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        productList: resolve(__dirname, "src/product-list/index.html")
      }
    }
  }
});