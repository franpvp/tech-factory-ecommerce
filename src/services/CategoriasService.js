import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { obtenerToken } from "../auth/tokenProvider";

import { ENV } from "../config/env";
const BASE_URL = ENV.SERVICE_CATEGORIAS;

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