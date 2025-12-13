import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import {
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario,
} from "../../../services/InventariosService";

export default function AdminInventarios() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    idProducto: "",
    cantidad: "",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    idProducto: "",
    cantidad: "",
  });

  // ==============================================
  // PAGINACIÓN
  // ==============================================
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(inventarios.length / pageSize);

  const paginatedInventarios = inventarios.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // mover página cuando eliminas el último ítem
  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages]);

  // =====================================================
  // CARGAR INVENTARIOS
  // =====================================================
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getInventarios();

        const mapped = data.map((inv) => ({
          idInventario: inv.id,
          idProducto: inv.idProducto,
          cantidad: inv.cantidad,
        }));

        setInventarios(mapped);
      } catch (error) {
        setApiError("No se pudieron cargar los inventarios");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // =====================================================
  // EDITAR
  // =====================================================
  const startEdit = (inv) => {
    setEditId(inv.idInventario);
    setFormEdit({
      idProducto: inv.idProducto,
      cantidad: inv.cantidad,
    });
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const body = { cantidad: Number(formEdit.cantidad) };

      const updated = await updateInventario(formEdit.idProducto, body);

      setInventarios((prev) =>
        prev.map((i) =>
          i.idInventario === updated.id
            ? { ...i, cantidad: updated.cantidad }
            : i
        )
      );

      setEditId(null);
    } catch {
      alert("Error al actualizar inventario");
    }
  };

  const cancelEdit = () => setEditId(null);

  // =====================================================
  // CREAR
  // =====================================================
  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const submitCreate = async (e) => {
    e.preventDefault();

    try {
      const body = {
        idProducto: Number(createForm.idProducto),
        cantidad: Number(createForm.cantidad),
      };

      const nuevo = await createInventario(body);

      setInventarios((prev) => [
        ...prev,
        {
          idInventario: nuevo.id,
          idProducto: nuevo.idProducto,
          cantidad: nuevo.cantidad,
        },
      ]);

      setCreateForm({ idProducto: "", cantidad: "" });
      setCreateOpen(false);
    } catch {
      alert("Error al crear inventario");
    }
  };

  // =====================================================
  // ELIMINAR
  // =====================================================
  const borrar = async (idInventario) => {
    if (!confirm("¿Eliminar inventario?")) return;

    try {
      await deleteInventario(idInventario);

      setInventarios((prev) =>
        prev.filter((i) => i.idInventario !== idInventario)
      );
    } catch {
      alert("Error al eliminar inventario");
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="text-black">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Inventarios</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-orange-500"
        >
          Nuevo Inventario
        </button>
      </div>

      {loading && <p>Cargando inventarios...</p>}

      {!loading && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow-xl border overflow-x-auto text-black">
            <table className="w-full min-w-[900px] text-center">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="py-3 px-3 text-center">ID Inventario</th>
                  <th className="py-3 px-3 text-center">ID Producto</th>
                  <th className="py-3 px-3 text-center">Cantidad</th>
                  <th className="py-3 px-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {paginatedInventarios.map((inv) => (
                  <tr
                    key={inv.idInventario}
                    className="border-b hover:bg-slate-50 text-center"
                  >
                    <td className="py-3 px-3">{inv.idInventario}</td>

                    <td className="px-3">{inv.idProducto}</td>

                    <td className="px-3">
                      {editId === inv.idInventario ? (
                        <input
                          name="cantidad"
                          value={formEdit.cantidad}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full text-center"
                        />
                      ) : (
                        inv.cantidad
                      )}
                    </td>

                    <td className="px-3">
                      {editId === inv.idInventario ? (
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
                            onClick={() => startEdit(inv)}
                            className="p-2 bg-blue-600 text-white rounded-full"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => borrar(inv.idInventario)}
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
                        ? "bg-orange-600 text-white shadow-md"
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
        </>
      )}

      {/* MODAL CREAR */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-700 p-6 relative text-white">

            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">
              Nuevo Inventario
            </h2>

            <form onSubmit={submitCreate} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold mb-1">ID Producto</label>
                <input
                  type="number"
                  name="idProducto"
                  value={createForm.idProducto}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white
                  focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={createForm.cantidad}
                  onChange={handleCreateChange}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white
                  focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

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
                  className="px-5 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-500 transition shadow-md"
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