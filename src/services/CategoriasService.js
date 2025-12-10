const BASE_URL = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_CATEGORIAS;

export async function getCategorias() {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Error al obtener categorías");
  }

  return res.json();
}

export async function createCategoria(body) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error al crear categoría");
  }

  return res.json();
}

export async function updateCategoria(id, body) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar categoría");
  }

  return res.json();
}

export async function deleteCategoria(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Error al eliminar categoría");
  }

  return true;
}