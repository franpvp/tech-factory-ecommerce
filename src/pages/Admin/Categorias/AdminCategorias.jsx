import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    nombre: "",
    descripcion: "",
  });

  // Modal Crear
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    descripcion: "",
  });

  // Datos temporales
  useEffect(() => {
    setCategorias([
      { id: 1, nombre: "Teclados Gamer", descripcion: "Teclados mecánicos y RGB" },
      { id: 2, nombre: "Monitores", descripcion: "Pantallas gamer y altas tasas de refresco" },
      { id: 3, nombre: "Periféricos RGB", descripcion: "Mouse, pads, luces y accesorios" },
    ]);
  }, []);

  // -------------------------------
  // EDITAR CATEGORÍA
  // -------------------------------
  const startEdit = (c) => {
    setEditId(c.id);
    setFormEdit({
      nombre: c.nombre,
      descripcion: c.descripcion,
    });
  };

  const handleEditChange = (e) => {
    setFormEdit({
      ...formEdit,
      [e.target.name]: e.target.value,
    });
  };

  const saveEdit = () => {
    setCategorias((prev) =>
      prev.map((cat) =>
        cat.id === editId
          ? { ...cat, nombre: formEdit.nombre, descripcion: formEdit.descripcion }
          : cat
      )
    );
    setEditId(null);
  };

  const cancelEdit = () => setEditId(null);

  // -------------------------------
  // CREAR CATEGORÍA
  // -------------------------------
  const handleCreateChange = (e) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value,
    });
  };

  const createCategoria = (e) => {
    e.preventDefault();

    const nuevoId =
      categorias.length > 0
        ? Math.max(...categorias.map((c) => c.id)) + 1
        : 1;

    const nuevaCategoria = {
      id: nuevoId,
      nombre: createForm.nombre,
      descripcion: createForm.descripcion,
    };

    setCategorias((prev) => [...prev, nuevaCategoria]);

    setCreateForm({
      nombre: "",
      descripcion: "",
    });
    setCreateOpen(false);
  };

  // -------------------------------
  // ELIMINAR CATEGORÍA
  // -------------------------------
  const deleteCategoria = (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Categorías</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="
            inline-flex items-center gap-2 
            bg-orange-600 text-white px-4 py-2 rounded-xl 
            text-sm font-semibold shadow-md 
            hover:bg-orange-500 active:scale-95 transition
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
          Nueva categoría
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-slate-800 border-b bg-slate-100/80">
              <th className="py-3 px-3 font-semibold text-sm">ID</th>
              <th className="py-3 px-3 font-semibold text-sm">Nombre</th>
              <th className="py-3 px-3 font-semibold text-sm">Descripción</th>
              <th className="py-3 px-3 font-semibold text-sm text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-slate-900">
            {categorias.map((c) => (
              <tr key={c.id} className="border-b hover:bg-slate-50 transition">
                <td className="py-4 px-3">{c.id}</td>

                {/* Nombre */}
                <td className="px-3">
                  {editId === c.id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formEdit.nombre}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    <span className="font-semibold text-orange-700">{c.nombre}</span>
                  )}
                </td>

                {/* Descripción */}
                <td className="px-3">
                  {editId === c.id ? (
                    <input
                      type="text"
                      name="descripcion"
                      value={formEdit.descripcion}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  ) : (
                    c.descripcion
                  )}
                </td>

                {/* Acciones */}
                <td className="px-3 text-center">
                  {editId === c.id ? (
                    <div className="flex justify-center gap-3">

                      {/* Guardar */}
                      <button
                        onClick={saveEdit}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                        title="Guardar"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>

                      {/* Cancelar */}
                      <button
                        onClick={cancelEdit}
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
                        onClick={() => startEdit(c)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                        title="Editar categoría"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => deleteCategoria(c.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                        title="Eliminar categoría"
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

        {categorias.length === 0 && (
          <p className="text-center py-8 text-slate-500">
            No hay categorías registradas.
          </p>
        )}
      </div>

      {/* MODAL CREAR CATEGORÍA */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 relative">

            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Nueva categoría
            </h2>

            <form onSubmit={createCategoria} className="space-y-4">

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={createForm.nombre}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={createForm.descripcion}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 active:scale-95"
                >
                  Guardar categoría
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}