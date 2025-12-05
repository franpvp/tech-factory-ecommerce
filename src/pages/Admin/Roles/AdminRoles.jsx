import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminRoles() {
  const [roles, setRoles] = useState([]);
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

  const endpoint = import.meta.env.VITE_API_ROLES;

  // Datos temporales
  useEffect(() => {
    setRoles([
      { id: 1, nombre: "ADMIN", descripcion: "Control total del sistema" },
      { id: 2, nombre: "USER", descripcion: "Acceso limitado" },
    ]);
  }, []);

  // ------------------------------
  // Editar Rol
  // ------------------------------
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

  const guardarCambios = () => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === editId ? { ...r, nombre: editForm.nombre, descripcion: editForm.descripcion } : r
      )
    );
    setEditId(null);
  };

  const cancelarEdicion = () => setEditId(null);

  // ------------------------------
  // Crear Rol
  // ------------------------------
  const handleCreateChange = (e) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value,
    });
  };

  const crearRol = (e) => {
    e.preventDefault();

    const nuevoId =
      roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;

    const nuevoRol = {
      id: nuevoId,
      nombre: createForm.nombre.toUpperCase(),
      descripcion: createForm.descripcion,
    };

    setRoles((prev) => [...prev, nuevoRol]);

    setCreateForm({
      nombre: "",
      descripcion: "",
    });
    setCreateOpen(false);
  };

  // ------------------------------
  // Eliminar Rol
  // ------------------------------
  const eliminarRol = (id) => {
    if (!confirm("¿Eliminar este rol?")) return;

    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Roles</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="
            bg-orange-600 text-white 
            px-4 py-2 rounded-xl
            inline-flex items-center gap-2
            shadow-md
            text-sm font-semibold
            hover:bg-orange-500 active:scale-95
            transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo rol
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="text-slate-800 border-b bg-slate-100/80">
              <th className="py-3 px-3 font-semibold text-sm">ID</th>
              <th className="py-3 px-3 font-semibold text-sm">Rol</th>
              <th className="py-3 px-3 font-semibold text-sm">Descripción</th>
              <th className="py-3 px-3 font-semibold text-sm text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="text-slate-900">
            {roles.map((r) => (
              <tr key={r.id} className="border-b hover:bg-slate-50 transition">
                <td className="py-4 px-3">{r.id}</td>

                <td className="px-3">
                  {editId === r.id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    <span className="font-semibold text-orange-700">{r.nombre}</span>
                  )}
                </td>

                <td className="px-3">
                  {editId === r.id ? (
                    <input
                      type="text"
                      name="descripcion"
                      value={editForm.descripcion}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    r.descripcion
                  )}
                </td>

                {/* ACCIONES */}
                <td className="px-3 text-center">
                  {editId === r.id ? (
                    <div className="flex justify-center gap-3">
                      {/* Guardar */}
                      <button
                        onClick={guardarCambios}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                        title="Guardar cambios"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>

                      {/* Cancelar */}
                      <button
                        onClick={cancelarEdicion}
                        className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition"
                        title="Cancelar"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3">
                      {/* Editar */}
                      <button
                        onClick={() => startEdit(r)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                        title="Editar rol"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => eliminarRol(r.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                        title="Eliminar rol"
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
          <p className="text-center py-8 text-slate-500">No hay roles registrados.</p>
        )}
      </div>

      {/* MODAL CREAR ROL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 relative">
            {/* Cerrar */}
            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Crear nuevo rol
            </h2>

            <form className="space-y-4" onSubmit={crearRol}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del rol
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={createForm.nombre}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={createForm.descripcion}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 active:scale-95"
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