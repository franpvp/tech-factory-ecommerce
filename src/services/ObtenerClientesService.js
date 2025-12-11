import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const ObtenerClientesService = async () => {
  const endpointClientes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;

  async function obtenerToken() {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        console.warn("No hay cuentas activas en MSAL.");
        return null;
      }

      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          account: accounts[0],
        });
        return response.accessToken;
      } catch (silentError) {
        if (silentError instanceof InteractionRequiredAuthError) {
          const popupResponse = await msalInstance.acquireTokenPopup({
            scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          });
          return popupResponse.accessToken;
        }
        throw silentError;
      }
    } catch (err) {
      console.error("Error obteniendo token:", err);
      return null;
    }
  }

  try {
    const token = await obtenerToken();

    const res = await fetch(endpointClientes, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Error al obtener clientes. Status: ${res.status} - ${errorText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Error en ObtenerClientesService:", error);
    throw error;
  }
};

export default ObtenerClientesService;