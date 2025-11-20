import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/authConfig"; // Importamos la instancia correcta

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </BrowserRouter>
);