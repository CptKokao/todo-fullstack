// import { registerSW } from "virtual:pwa-register";
import { AuthForm } from "./components/AuthForm/AuthForm";
import { Page } from "./components/Page/Page";

// registerSW({ immediate: true });

function App() {
  const storedToken = localStorage.getItem("jwt_token");

  // Если нет токена и мы не находимся на корневой странице,
  // используем Navigate для перенаправления.
  if (!storedToken) {
    return <AuthForm />;
  }

  return <Page />;
}

export default App;
