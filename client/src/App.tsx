import { Navigate, Route, Routes, useLocation } from "react-router";

// import { registerSW } from "virtual:pwa-register";
import { AuthForm } from "./components/AuthForm/AuthForm";
import { Main } from "./components/Page/Page";

// export const links: Route.LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },

//   {
//     rel: "preconnect",
//     href: "https://fonts.gstatic.com",
//     crossOrigin: "anonymous",
//   },
//   {
//     rel: "stylesheet",
//     href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
//   },
// ];

// registerSW({ immediate: true });

function App() {
  const location = useLocation();
  const storedToken = localStorage.getItem("jwt_token");

  // Если нет токена и мы не находимся на корневой странице,
  // используем Navigate для перенаправления.
  if (!storedToken && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/todo" element={<Main />} />
        {/* <Route path="/" element={storedToken ? <Main /> : <AuthForm />} />
        <Route path="/todo" element={storedToken ? <Main /> : <AuthForm />} /> */}
      </Routes>
    </>
  );
}

export default App;
// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
//   let message = "Oops!";
//   let details = "An unexpected error occurred.";
//   let stack: string | undefined;

//   if (isRouteErrorResponse(error)) {
//     message = error.status === 404 ? "404" : "Error";
//     details =
//       error.status === 404
//         ? "The requested page could not be found."
//         : error.statusText || details;
//   } else if (import.meta.env.DEV && error && error instanceof Error) {
//     details = error.message;
//     stack = error.stack;
//   }

//   return (
//     <main className="pt-16 p-4 container mx-auto">
//       <h1>{message}</h1>
//       <p>{details}</p>
//       {stack && (
//         <pre className="w-full p-4 overflow-x-auto">
//           <code>{stack}</code>
//         </pre>
//       )}
//     </main>
//   );
// }
