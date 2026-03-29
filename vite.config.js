import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
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
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        productList: resolve(__dirname, "src/product-list/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        login: resolve(__dirname, "src/login/index.html"),
        register: resolve(__dirname, "src/register/index.html"),
        wishlist: resolve(__dirname, "src/wishlist/index.html")
      }
    }
  }
});