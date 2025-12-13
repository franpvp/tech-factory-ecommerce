import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { msalInstance } from "../../../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

import ObtenerClientesService from "../../../services/ObtenerClientesService";

export default function AdminUsuarios() {

  const endpointUsuarios = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;

  // ==========================================================
  // TOKEN
  // ==========================================================
  const obtenerToken = async () => {
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
      console.error("Error obteniendo token JWT:", err);
      return null;
    }
  };

  // ==========================================================
  // ESTADO
  // ==========================================================
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edición
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  // Nuevo usuario
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    rol: "CLIENTE",
  });

  // ==========================================================
  // PAGINACIÓN
  // ==========================================================
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(usuarios.length / pageSize);

  const paginatedUsuarios = usuarios.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Ajustar página si se elimina el último registro de la página
  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages]);

  // ==========================================================
  // CARGA INICIAL
  // ==========================================================
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const data = await ObtenerClientesService();

      const parsed = data.map((c) => ({
        id: c.id,
        idUsuario: c.usuario?.id,
        nombre: c.nombre,
        apellido: c.apellido,
        email: c.usuario?.email,
        telefono: c.telefono,
        direccion: c.direccion,
        ciudad: c.ciudad,
        fechaRegistro: (c.fechaRegistro || "").slice(0, 10),
        rol: c.usuario?.tipoUsuario?.nombreTipo ?? "CLIENTE",
      }));

      setUsuarios(parsed);
      setLoading(false);
    };

    loadUsers();
  }, []);

  // ==========================================================
  // CREAR USUARIO
  // ==========================================================
  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    const token = await obtenerToken();
    if (!token) {
      alert("Debe iniciar sesión para crear usuarios.");
      return;
    }

    const res = await fetch(endpointUsuarios, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createForm),
    });

    if (!res.ok) {
      alert("Error al crear usuario");
      return;
    }

    const nuevo = await res.json();
    setUsuarios((prev) => [...prev, nuevo]);
    setCreateOpen(false);
  };

  // ==========================================================
  // EDITAR
  // ==========================================================
  const startEdit = (u) => {
    setEditId(u.id);
    setEditForm({
      nombre: u.nombre,
      apellido: u.apellido,
      telefono: u.telefono,
      direccion: u.direccion,
      ciudad: u.ciudad,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    const token = await obtenerToken();
    if (!token) return alert("Debe iniciar sesión.");

    const payload = {
      nombre: editForm.nombre,
      apellido: editForm.apellido,
      telefono: editForm.telefono,
      direccion: editForm.direccion,
      ciudad: editForm.ciudad,
    };

    const res = await fetch(`${endpointUsuarios}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Error en actualización:", await res.text());
      return alert("Error al actualizar usuario");
    }

    const updated = await res.json();

    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? updated : u))
    );

    setEditId(null);
  };

  const cancelEdit = () => setEditId(null);

  // ==========================================================
  // ELIMINAR
  // ==========================================================
  const deleteUser = async (id) => {
    const token = await obtenerToken();
    if (!token) return alert("Debe iniciar sesión.");

    const ok = confirm("¿Desea eliminar este usuario?");
    if (!ok) return;

    await fetch(`${endpointUsuarios}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <div className="text-slate-900">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-blue-500"
        >
          + Nuevo usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow border overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b font-semibold text-slate-700 bg-slate-50">
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">ID Usuario</th>
              <th className="py-2 px-3 text-left">Nombre</th>
              <th className="py-2 px-3 text-left">Apellido</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Teléfono</th>
              <th className="py-2 px-3 text-left">Dirección</th>
              <th className="py-2 px-3 text-left">Ciudad</th>
              <th className="py-2 px-3 text-left">Fecha Registro</th>
              <th className="py-2 px-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsuarios.map((u) => {
              const editing = editId === u.id;

              return (
                <tr key={u.id} className="border-b hover:bg-slate-50">

                  <td className="py-3 px-3">{u.id}</td>
                  <td className="px-3">{u.idUsuario}</td>

                  {/* NOMBRE */}
                  <td className="px-3">
                    {editing ? (
                      <input
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.nombre
                    )}
                  </td>

                  {/* APELLIDO */}
                  <td className="px-3">
                    {editing ? (
                      <input
                        name="apellido"
                        value={editForm.apellido}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.apellido
                    )}
                  </td>

                  <td className="px-3">{u.email}</td>

                  {/* Teléfono */}
                  <td className="px-3">
                    {editing ? (
                      <input
                        name="telefono"
                        value={editForm.telefono}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.telefono
                    )}
                  </td>

                  {/* Dirección */}
                  <td className="px-3">
                    {editing ? (
                      <input
                        name="direccion"
                        value={editForm.direccion}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.direccion
                    )}
                  </td>

                  {/* Ciudad */}
                  <td className="px-3">
                    {editing ? (
                      <input
                        name="ciudad"
                        value={editForm.ciudad}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.ciudad
                    )}
                  </td>

                  <td className="px-3">{u.fechaRegistro}</td>

                  {/* ACCIONES */}
                  <td className="px-3 text-right space-x-2">
                    {!editing ? (
                      <>
                        <button
                          onClick={() => startEdit(u)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => saveEdit(u.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 gap-2">

          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`
              flex items-center justify-center w-9 h-9 rounded-full border transition
              ${page === 1
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }
            `}
          >
            <span className="text-lg font-bold">‹</span>
          </button>

          {/* Numbers */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const num = i + 1;
            const active = num === page;

            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`
                  w-9 h-9 rounded-full text-sm font-medium transition
                  ${active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-200"
                  }
                `}
              >
                {num}
              </button>
            );
          })}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`
              flex items-center justify-center w-9 h-9 rounded-full border transition
              ${page === totalPages
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }
            `}
          >
            <span className="text-lg font-bold">›</span>
          </button>

        </div>
      )}

      {/* MODAL CREAR */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-700 p-6 relative text-white">

            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
              Nuevo Usuario
            </h2>

            <form className="space-y-5" onSubmit={crearUsuario}>

              {/* NOMBRE - APELLIDO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nombre</label>
                  <input
                    name="nombre"
                    value={createForm.nombre}
                    onChange={handleCreateChange}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Apellido</label>
                  <input
                    name="apellido"
                    value={createForm.apellido}
                    onChange={handleCreateChange}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* TELÉFONO - CIUDAD */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Teléfono</label>
                  <input
                    name="telefono"
                    value={createForm.telefono}
                    onChange={handleCreateChange}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Ciudad</label>
                  <input
                    name="ciudad"
                    value={createForm.ciudad}
                    onChange={handleCreateChange}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* DIRECCIÓN */}
              <div>
                <label className="block text-sm font-semibold mb-1">Dirección</label>
                <input
                  name="direccion"
                  value={createForm.direccion}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ROL */}
              <div>
                <label className="block text-sm font-semibold mb-1">Rol</label>
                <select
                  name="rol"
                  value={createForm.rol}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-500 text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition shadow-md"
                >
                  Crear Usuario
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}