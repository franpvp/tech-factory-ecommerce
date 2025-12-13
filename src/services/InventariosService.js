import { obtenerToken } from "../auth/tokenProvider";

const API = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_INVENTARIOS;

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
