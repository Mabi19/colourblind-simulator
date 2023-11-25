import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    server: { https: true },
    plugins: [vue(), mkcert()],
    define: {
        APP_VERSION: "\"1.0\"",
    },
    base: "/colourblind-simulator/"
})
