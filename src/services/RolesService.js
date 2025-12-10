const BASE_URL = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_ROLES;

export async function getRoles() {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Error al obtener roles");
  }

  return res.json();
}

export async function createRole(body) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error al crear rol");
  }

  return res.json();
}

export async function updateRole(id, body) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar rol");
  }

  return res.json();
}

export async function deleteRole(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar rol");
  }

  return true;
}