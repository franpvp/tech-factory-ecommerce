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
    "perifericos-img/",
    "almacenamiento-img/",
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
          <table className="w-full min-w-[900px] text-black">
            <thead>
              <tr className="bg-slate-100 border-b text-black">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Nombre</th>
                <th className="py-3 px-3">Descripción</th>
                <th className="py-3 px-3">Directorio Bucket</th>
                <th className="py-3 px-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c) => (
                <tr key={c.id} className="border-b hover:bg-slate-50 text-black">
                  <td className="py-3 px-3">{c.id}</td>

                  {/* Nombre */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <input
                        name="nombre"
                        value={formEdit.nombre}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <span className="font-semibold">{c.nombre}</span>
                    )}
                  </td>

                  {/* Descripción */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <input
                        name="descripcion"
                        value={formEdit.descripcion}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      c.descripcion
                    )}
                  </td>

                  {/* Directorio Bucket */}
                  <td className="px-3">
                    {editId === c.id ? (
                      <select
                        name="nombreDirectorio"
                        value={formEdit.nombreDirectorio}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full text-black"
                      >
                        <option value="">Seleccione...</option>
                        {directoriosBucket.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{c.nombreDirectorio}</span>
                    )}
                  </td>

                  {/* ACCIONES */}
                  <td className="text-center px-3">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 text-black rounded-2xl w-full max-w-lg shadow-xl relative">

            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Nueva categoría</h2>

            <form onSubmit={submitCreate} className="space-y-4">

              <div>
                <label className="text-sm font-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={createForm.nombre}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={createForm.descripcion}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Directorio Bucket</label>
                <select
                  name="nombreDirectorio"
                  value={createForm.nombreDirectorio}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2 text-black"
                  required
                >
                  <option value="">Seleccione...</option>
                  {directoriosBucket.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 text-white rounded font-semibold"
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