const API = import.meta.env.VITE_API_INVENTARIOS;

export async function getInventarios() {
  const res = await fetch(API, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

export async function getInventarioPorProducto(idProducto) {
  const res = await fetch(`${API}/producto/${idProducto}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

export async function createInventario(body) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateInventario(idProducto, body) {
  const res = await fetch(`${API}/producto/${idProducto}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteInventario(idInventario) {
  await fetch(`${API}/${idInventario}`, { method: "DELETE" });
}