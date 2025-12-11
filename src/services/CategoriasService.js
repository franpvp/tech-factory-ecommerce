import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const BASE_URL = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_CATEGORIAS;

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
  } catch (error) {
    console.error("Error obteniendo token JWT:", error);
    return null;
  }
}

export async function getCategorias() {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Error al obtener categorías");
  }

  return res.json();
}

export async function createCategoria(body) {
  const token = await obtenerToken();

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error al crear categoría");
  }

  return res.json();
}

// ======================================================
// 3. Actualizar categoría (requiere JWT)
// ======================================================
export async function updateCategoria(id, body) {
  const token = await obtenerToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar categoría");
  }

  return res.json();
}

export async function deleteCategoria(id) {
  const token = await obtenerToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar categoría");
  }

  return true;
}