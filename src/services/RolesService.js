import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const BASE_URL = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_ROLES;

async function obtenerToken() {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        account: accounts[0],
      });

      return response.accessToken;

    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        const popupResponse = await msalInstance.acquireTokenPopup({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        });
        return popupResponse.accessToken;
      }
      throw e;
    }

  } catch (e) {
    console.error("Error obteniendo token JWT:", e);
    return null;
  }
}

export async function getRoles() {
  const token = await obtenerToken();

  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener roles");
  }

  return res.json();
}

export async function createRole(body) {
  const token = await obtenerToken();

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al crear rol");
  return res.json();
}

export async function updateRole(id, body) {
  const token = await obtenerToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al actualizar rol");
  return res.json();
}

export async function deleteRole(id) {
  const token = await obtenerToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar rol");
  return true;
}