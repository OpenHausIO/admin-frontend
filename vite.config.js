import { fileURLToPath, URL } from "url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

import { config } from "dotenv";
config();

const {
    BACKEND_HOST,
    BACKEND_PORT,
    BACKEND_PROTOCOL
} = process.env = Object.assign({
    BACKEND_HOST: "127.0.0.1",
    BACKEND_PORT: "8080",
    BACKEND_PROTOCOL: "http"
}, process.env);


console.log("URL", `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`);

const aboutJson = () => ({
    configureServer(server) {
        server.middlewares.use("/admin/about.json", (req, res, next) => {
            const { version } = require("./package.json");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ version }));
        });
    },
});

const redirect = () => ({
    configureServer(server) {
        server.middlewares.use("/user", (req, res, next) => {

            res.writeHead(302, {
                Location: "http://localhost:3001/user/"
            });

            res.end();

        });
    },
});


// https://vitejs.dev/config/
export default defineConfig({
    base: "/admin/",
    plugins: [
        vue(),
        aboutJson(),
        redirect()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    server: {
        port: 3002,
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`,
                ws: true,
                xfwd: true,
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader("Host", `${BACKEND_HOST}:${BACKEND_PORT}`);
                    });
                }
            },
            "/auth": {
                target: `${BACKEND_PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`,
                xfwd: true,
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq) => {
                        proxyReq.setHeader("Host", `${BACKEND_HOST}:${BACKEND_PORT}`);
                    });
                }
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