import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"


// https://vite.dev/config/
export default defineConfig({
    plugins: [ react(), tailwindcss() ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        // enable file polling inside Docker (set VITE_USE_POLLING=true) so hot reload
        // works over Windows/WSL2 bind mounts; left off for normal local dev
        watch: process.env.VITE_USE_POLLING ? { usePolling: true } : undefined,
    }
})