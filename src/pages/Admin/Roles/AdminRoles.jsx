import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../../services/RolesService";

export default function AdminRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    descripcion: "",
  });

  // ===============================
  // CARGAR ROLES
  // ===============================
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getRoles();

        // Mapear al formato interno que usamos en el front
        const mapeados = data.map((r) => ({
          id: r.id,
          nombre: r.nombreTipo,
          descripcion: r.descripcion,
        }));

        setRoles(mapeados);
      } catch (err) {
        setApiError("");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({
      nombre: r.nombre,
      descripcion: r.descripcion,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = async () => {
    try {
      const body = {
        nombreTipo: editForm.nombre.trim().toUpperCase(),
        descripcion: editForm.descripcion,
      };

      await updateRole(editId, body);

      setRoles((prev) =>
        prev.map((r) =>
          r.id === editId
            ? { ...r, nombre: body.nombreTipo, descripcion: body.descripcion }
            : r
        )
      );

      setEditId(null);
    } catch (err) {
      alert("Error al guardar cambios");
    }
  };

  const cancelarEdicion = () => setEditId(null);

  const handleCreateChange = (e) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value,
    });
  };

  const crearRol = async (e) => {
    e.preventDefault();

    try {
      const body = {
        nombreTipo: createForm.nombre.trim().toUpperCase(),
        descripcion: createForm.descripcion,
      };

      const nuevo = await createRole(body);

      setRoles((prev) => [
        ...prev,
        {
          id: nuevo.id,
          nombre: nuevo.nombreTipo,
          descripcion: nuevo.descripcion,
        },
      ]);

      setCreateForm({ nombre: "", descripcion: "" });
      setCreateOpen(false);
    } catch (err) {
      alert("Error al crear rol");
    }
  };

  const eliminarRol = async (id) => {
    if (!confirm("¿Eliminar este rol?")) return;

    try {
      await deleteRole(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Error al eliminar rol");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Roles</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md text-sm font-semibold hover:bg-orange-500 active:scale-95 transition"
        >
          Nuevo rol
        </button>
      </div>

      {loading && <p className="text-slate-500">Cargando roles...</p>}
      {apiError && <p className="text-red-500">{apiError}</p>}

      {!loading && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="text-slate-800 border-b bg-slate-100/80">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Descripción</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="text-slate-900">
              {roles.map((r) => (
                <tr key={r.id} className="border-b hover:bg-slate-50 transition">
                  <td className="py-4 px-3">{r.id}</td>

                  <td className="px-3">
                    {editId === r.id ? (
                      <input
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="font-semibold text-orange-700">
                        {r.nombre}
                      </span>
                    )}
                  </td>

                  <td className="px-3">
                    {editId === r.id ? (
                      <input
                        name="descripcion"
                        value={editForm.descripcion}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      r.descripcion
                    )}
                  </td>

                  <td className="px-3 text-center">
                    {editId === r.id ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={guardarCambios}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={cancelarEdicion}
                          className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-700"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => startEdit(r)}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => eliminarRol(r.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {roles.length === 0 && (
            <p className="text-center py-8 text-slate-500">
              No hay roles registrados.
            </p>
          )}
        </div>
      )}

      {/* MODAL CREACIÓN */}
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

            <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">
              Crear nuevo rol
            </h2>

            <form onSubmit={crearRol} className="space-y-5">

              {/* NOMBRE */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-200">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={createForm.nombre}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-zinc-200">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={createForm.descripcion}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-500 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 transition shadow-md"
                >
                  Guardar rol
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}