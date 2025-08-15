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
  // build: {
  //   outDir: "build/client", // Убедитесь, что клиентская сборка идет сюда
  //   emptyOutDir: true,
  // },
  server: {
    // НОВОЕ: Включаем HTTPS

    // (опционально) Здесь можно указать пути к сертификатам, если mkcert разместил их в другом месте
    // https: {
    //   key: "./localhost+2-key.pem",
    //   cert: "./localhost+2.pem",
    // },
    port: 3000,
  },
  plugins: [
    react(),
    // VitePWA({
    //   // mode: "development",
    //   // base: "/",
    //   injectRegister: "auto",
    //   // registerType: "autoUpdate",
    //   devOptions: {
    //     enabled: true,
    //     /* when using generateSW the PWA plugin will switch to classic */
    //     type: "module",
    //     // navigateFallback: "index.html",
    //   },
    //   manifest: {
    //     name: "Todo App",
    //     short_name: "Todo",
    //     description: "A simple Todo application",
    //     theme_color: "#ffffff",
    //     icons: [
    //       {
    //         src: "pwa-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "pwa-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     // Оптимизированный globPatterns для продакшн-сборки Vite
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
    //     // globDirectory: "build/client/",
    //     runtimeCaching: [
    //       {
    //         urlPattern: ({ url, sameOrigin }) =>
    //           sameOrigin && url.pathname.match(/^\/api\//),
    //         handler: "NetworkFirst",
    //         method: "POST",
    //         options: {
    //           backgroundSync: {
    //             name: "myQueueName",
    //             options: {
    //               maxRetentionTime: 24 * 60,
    //             },
    //           },
    //         },
    //       },
    //       // Стратегия для GET-запросов к API: сначала сеть, потом кэш
    //       // {
    //       //   urlPattern: ({ url, sameOrigin }) =>
    //       //     sameOrigin && url.pathname.match(/^\/(api|article)\/.*/i),
    //       //   // urlPattern: ({ url }) =>
    //       //   //   url.pathname.startsWith("/api/todos") &&
    //       //   //   url.searchParams.get("method") !== "POST",
    //       //   handler: "NetworkFirst",
    //       //   options: {
    //       //     cacheName: "api-cache",
    //       //     expiration: {
    //       //       maxEntries: 50,
    //       //       maxAgeSeconds: 60 * 60 * 24, // 24 часа
    //       //     },
    //       //   },
    //       // },
    //       // // Стратегия для POST-запросов: только сеть с фоновой синхронизацией
    //       // {
    //       //   urlPattern: ({ url }) => url.pathname.match(/^\/(api)\/.*/i),
    //       //   // urlPattern: ({ url }) => url.pathname.startsWith("/api/todos"),
    //       //   handler: "NetworkOnly",
    //       //   method: "POST",
    //       //   options: {
    //       //     backgroundSync: {
    //       //       name: "addTodoQueue",
    //       //       options: {
    //       //         maxRetentionTime: 24 * 60,
    //       //       },
    //       //     },
    //       //   },
    //       // },
    //     ],
    //   },
    // }),
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
