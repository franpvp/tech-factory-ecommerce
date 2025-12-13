import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../../services/CategoriasService";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    nombre: "",
    descripcion: "",
    nombreDirectorio: ""
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    descripcion: "",
    nombreDirectorio: ""
  });

  // SIMULACIÓN: estos son los directorios válidos del bucket
  const directoriosBucket = [
    "tarjetas-graficas-img/",
    "procesadores-img/",
    "placas-madre-img/",
    "refrigeracion-img/",
    "almacenamiento-img/",
    "fuentes-poder-img/",
    "gabinetes-img/",
  ];

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getCategorias();

        const mapped = data.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          descripcion: c.descripcion,
          nombreDirectorio: c.nombreDirectorio
        }));

        setCategorias(mapped);
      } catch (error) {
        setApiError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const startEdit = (c) => {
    setEditId(c.id);
    setFormEdit({
      nombre: c.nombre,
      descripcion: c.descripcion,
      nombreDirectorio: c.nombreDirectorio
    });
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const body = {
        nombre: formEdit.nombre,
        descripcion: formEdit.descripcion,
        nombreDirectorio: formEdit.nombreDirectorio
      };

      await updateCategoria(editId, body);

      setCategorias((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...body } : c))
      );

      setEditId(null);
    } catch (err) {
      alert("Error al actualizar categoría");
    }
  };

  const cancelEdit = () => setEditId(null);

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const submitCreate = async (e) => {
    e.preventDefault();

    try {
      const body = {
        nombre: createForm.nombre,
        descripcion: createForm.descripcion,
        nombreDirectorio: createForm.nombreDirectorio
      };

      const nueva = await createCategoria(body);

      setCategorias((prev) => [
        ...prev,
        {
          id: nueva.id,
          nombre: nueva.nombre,
          descripcion: nueva.descripcion,
          nombreDirectorio: nueva.nombreDirectorio
        },
      ]);

      setCreateForm({ nombre: "", descripcion: "", nombreDirectorio: "" });
      setCreateOpen(false);
    } catch (error) {
      alert("Error al crear categoría");
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;

    try {
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar categoría");
    }
  };

  return (
    <div className="text-black">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Gestión de Categorías</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-orange-500"
        >
          Nueva categoría
        </button>
      </div>

      {loading && <p className="text-black">Cargando...</p>}

      {!loading && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border overflow-x-auto text-black">
          <table className="w-full min-w-[900px] text-center">
            <thead>
              <tr className="bg-slate-100 border-b text-black">
                <th className="py-3 px-3 text-center">ID</th>
                <th className="py-3 px-3 text-center">Nombre</th>
                <th className="py-3 px-3 text-center">Descripción</th>
                <th className="py-3 px-3 text-center">Directorio Bucket</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-slate-50 text-black text-center"
                >
                  <td className="py-3 px-3">{c.id}</td>

                  {/* NOMBRE */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <input
                        name="nombre"
                        value={formEdit.nombre}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full text-center"
                      />
                    ) : (
                      <span className="font-semibold">{c.nombre}</span>
                    )}
                  </td>

                  {/* DESCRIPCIÓN */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <input
                        name="descripcion"
                        value={formEdit.descripcion}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full text-center"
                      />
                    ) : (
                      c.descripcion
                    )}
                  </td>

                  {/* DIRECTORIO */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <select
                        name="nombreDirectorio"
                        value={formEdit.nombreDirectorio}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full text-center text-black"
                      >
                        <option value="">Seleccione...</option>
                        {directoriosBucket.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{c.nombreDirectorio}</span>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={saveEdit}
                          className="p-2 bg-green-600 text-white rounded-full"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-slate-600 text-white rounded-full"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => startEdit(c)}
                          className="p-2 bg-blue-600 text-white rounded-full"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => borrar(c.id)}
                          className="p-2 bg-red-600 text-white rounded-full"
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
        </div>
      )}

      {/* MODAL CREAR */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-700 p-6 relative text-white">

            {/* CERRAR */}
            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">
              Nueva Categoría
            </h2>

            <form onSubmit={submitCreate} className="space-y-5">

              {/* NOMBRE */}
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={createForm.nombre}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={createForm.descripcion}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              {/* DIRECTORIO BUCKET */}
              <div>
                <label className="block text-sm font-semibold mb-1">Directorio Bucket</label>
                <select
                  name="nombreDirectorio"
                  value={createForm.nombreDirectorio}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                >
                  <option value="">Seleccione...</option>
                  {directoriosBucket.map((d) => (
                    <option key={d} value={d} className="text-black">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-500 transition shadow-md"
                >
                  Guardar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}