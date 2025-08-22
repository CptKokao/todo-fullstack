// import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Базовый путь для ассетов. Должен совпадать с путем,
  // по которому они будут доступны в браузере.
  base: "./",

  // Указываем Vite, куда выводить файлы.
  // Это должно совпадать с output React Router.
  build: {
    outDir: "build", // Убедитесь, что клиентская сборка идет сюда
    emptyOutDir: true,
  },
  server: {
    // НОВОЕ: Включаем HTTPS

    // (опционально) Здесь можно указать пути к сертификатам, если mkcert разместил их в другом месте
    https: {
      key: "./cert/localhost-key.pem",
      cert: "./cert/localhost.pem",
    },
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
        // navigateFallback: "index.html",
      },
      manifest: {
        name: "Todo App name",
        short_name: "Todo App short_name",
        description: "A simple Todo application",
        theme_color: "#e70000",
        background_color: "#e70000",
        display: "standalone",
        screenshots: [
          {
            src: "screen-desktop.png",
            sizes: "691x740",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "screen-mobile.png",
            sizes: "384x692",
            type: "image/png",
            form_factor: "wide",
          },
        ],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf,eot}",
        ],
        runtimeCaching: [
          // API caching with background sync
          // {
          //   urlPattern: ({ url, sameOrigin }) =>
          //     sameOrigin && url.pathname.match(/^\/api\//),
          //   handler: "NetworkFirst",
          //   method: "POST",
          //   options: {
          //     cacheName: "api-post-cache",
          //     backgroundSync: {
          //       name: "apiPostQueue",
          //       options: {
          //         maxRetentionTime: 24 * 60,
          //       },
          //     },
          //   },
          // },
          // GET API requests caching
          {
            urlPattern: ({ url, sameOrigin }) => url.pathname.match(/^\/api\//),
            // sameOrigin && url.pathname.match(/^\/api\//),
            handler: "NetworkFirst",
            method: "GET",
            options: {
              cacheName: "api-get-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          // Google Fonts caching
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
    // basicSsl({
    //   /** name of certification */
    //   name: "test",
    //   /** custom trust domains */
    //   domains: ["localhost"],
    //   /** custom certification directory */
    //   certDir: "/Users/.../.devServer/cert",
    // }),
    tailwindcss(),
    // reactRouter(),
    // tsconfigPaths(),
  ],
});
