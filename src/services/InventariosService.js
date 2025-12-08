const API = "http://localhost:8083/api/v1/inventarios";

export async function getInventarios() {
  const res = await fetch(API + "/");
  return res.json();
}

export async function getInventarioPorProducto(idProducto) {
  const res = await fetch(`${API}/producto/${idProducto}`);
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