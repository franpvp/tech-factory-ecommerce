const BASE_URL = import.meta.env.VITE_API_ROLES;

// ======================================
// GET → listar todos los roles
// ======================================
export async function getRoles() {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Error al obtener roles");
  }

  return res.json();
}

// ======================================
// POST → crear un rol
// ======================================
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

// ======================================
// PUT → actualizar rol
// ======================================
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

// ======================================
// DELETE → eliminar rol
// ======================================
export async function deleteRole(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar rol");
  }

  return true;
}