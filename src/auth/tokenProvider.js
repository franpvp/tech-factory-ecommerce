import { msalInstance } from "./authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const isTestMode = import.meta.env.VITE_TEST_MODE === "true";
const SCOPES = ["api://967bfb43-f7a4-47db-8502-588b15908297/access"];

export async function obtenerToken() {

  // 🟢 MODO TEST → token fijo
  if (isTestMode) {
    return "TEST_TOKEN";
  }

  try {
    const accounts = msalInstance.getAllAccounts();
    if (!accounts.length) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: SCOPES,
        account: accounts[0],
      });

      return response.accessToken;

    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        const popup = await msalInstance.acquireTokenPopup({
          scopes: SCOPES,
        });
        return popup.accessToken;
      }
      throw err;
    }

  } catch (error) {
    console.error("Error obteniendo token:", error);
    return null;
  }
}
