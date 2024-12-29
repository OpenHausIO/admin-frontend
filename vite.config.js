import { fileURLToPath, URL } from "url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const {
    BACKEND_HOST,
    BACKEND_PORT,
    BACKEND_PROTOCOL
} = process.env = Object.assign({
    BACKEND_HOST: "127.0.0.1",
    BACKEND_PORT: "8080",
    BACKEND_PROTOCOL: "http"
}, process.env);

// https://vitejs.dev/config/
export default defineConfig({
    base: "/admin/",
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    server: {
        port: 3001,
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`,
                ws: true
            },
            "/auth": {
                target: `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`
            }
        }
    },
    build: {
        outDir: "build",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: "admin-[name].[hash].js",
                chunkFileNames: "admin-[name].[hash].js",
                assetFileNames: ({ name }) => {
                    return "admin-[name].[hash].[ext]";
                },
            },
        },
    },
    clearScreen: false
});