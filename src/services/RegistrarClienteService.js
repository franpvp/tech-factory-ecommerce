import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export const RegistrarClienteService = async () => {
  const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_REGISTRO_CLIENTES;

  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      console.warn("No hay cuentas activas en MSAL.");
      return;
    }
    let response = await msalInstance.acquireTokenSilent({
      scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
      account: accounts[0],
    });

    const token = response.accessToken;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al sincronizar cliente");
    }

    return await res.json();
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      console.log("Se requiere interacción para obtener token (popup)");

      const resp = await msalInstance.acquireTokenPopup({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
      });

      return resp;
    }

    console.error("Error en RegistrarClienteService:", error);
    throw error;
  }
};