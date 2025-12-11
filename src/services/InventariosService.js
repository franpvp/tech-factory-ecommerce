import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const API = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_INVENTARIOS;

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

export async function getInventarios() {
  const token = await obtenerToken();

  const res = await fetch(API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function getInventarioPorProducto(idProducto) {
  const token = await obtenerToken();

  const res = await fetch(`${API}/producto/${idProducto}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

// ======================================================
// POST — crear inventario
// ======================================================
export async function createInventario(body) {
  const token = await obtenerToken();

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function updateInventario(idProducto, body) {
  const token = await obtenerToken();

  const res = await fetch(`${API}/producto/${idProducto}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function deleteInventario(idInventario) {
  const token = await obtenerToken();

  await fetch(`${API}/${idInventario}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return true;
}