import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { getCategorias } from "../../../services/CategoriasService";

import { msalInstance } from "../../../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

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

    } catch (silentErr) {
      if (silentErr instanceof InteractionRequiredAuthError) {
        const popupResponse = await msalInstance.acquireTokenPopup({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        });
        return popupResponse.accessToken;
      }
      throw silentErr;
    }
  } catch (err) {
    return null;
  }
};

export default function AdminProductos() {
  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;
  const endpointBucket = import.meta.env.VITE_BUCKET;

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // control edición inline
  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    marca: "",
    precio: "",
    imagenUrl: "",
  });

  // crear
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    marca: "",
    precio: "",
    nombreImagen: "",
  });

  // ==========================================
  // PAGINACIÓN
  // ==========================================
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  const visibleProductos = productos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    const loadData = async () => {
      const categoriasBD = await getCategorias();
      setCategorias(categoriasBD);

      const response = await fetch(endpointProductos);
      const data = await response.json();
      setProductos(data);
      setPage(1); // reset página
    };

    loadData();
  }, []);

  // ============= CREAR PRODUCTO =============
  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const createProduct = async (e) => {
    e.preventDefault();

    try {
      const token = await obtenerToken();
      if (!token) return alert("No se pudo obtener el token.");

      const categoria = categorias.find(c => c.id === Number(createForm.idCategoria));
      if (!categoria) return alert("Categoría no encontrada");

      const imagenUrl = `${endpointBucket}/${categoria.nombreDirectorio}${createForm.nombreImagen}`;

      const payload = {
        idCategoria: Number(createForm.idCategoria),
        nombre: createForm.nombre,
        descripcion: createForm.descripcion,
        marca: createForm.marca,
        precio: Number(createForm.precio),
        imagenUrl,
      };

      const res = await fetch(endpointProductos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error creando producto");

      const nuevoProducto = await res.json();
      setProductos((prev) => [...prev, nuevoProducto]);
      setCreateOpen(false);
    } catch (error) {
      alert("Error al crear producto");
    }
  };

  // ============= EDITAR INLINE =============
  const startEdit = (p) => {
    setEditId(p.id);
    setFormEdit({
      idCategoria: p.idCategoria,
      nombre: p.nombre,
      descripcion: p.descripcion,
      marca: p.marca,
      precio: p.precio,
      imagenUrl: p.imagenUrl,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const token = await obtenerToken();
      if (!token) return alert("No se pudo obtener el token.");

      const payload = {
        idCategoria: Number(formEdit.idCategoria),
        nombre: formEdit.nombre,
        descripcion: formEdit.descripcion,
        marca: formEdit.marca,
        precio: Number(formEdit.precio),
        imagenUrl: formEdit.imagenUrl,
      };

      const res = await fetch(`${endpointProductos}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error actualizando producto");

      const actualizado = await res.json();

      setProductos((prev) =>
        prev.map((p) => (p.id === id ? actualizado : p))
      );

      setEditId(null);
    } catch (error) {
      alert("Error guardando cambios");
    }
  };

  // ============= ELIMINAR =============
  const deleteProduct = async (id) => {
    try {
      const token = await obtenerToken();
      if (!token) return alert("No se pudo obtener el token.");

      await fetch(`${endpointProductos}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <div className="text-slate-900">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-blue-500"
        >
          + Nuevo producto
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b font-semibold text-slate-700 bg-slate-50">
              <th className="py-2 px-3 text-left">Imagen</th>
              <th className="py-2 px-3 text-left">Nombre</th>
              <th className="py-2 px-3 text-left">Descripción</th>
              <th className="py-2 px-3 text-left">Marca</th>
              <th className="py-2 px-3 text-left">Categoría</th>
              <th className="py-2 px-3 text-left">Precio</th>
              <th className="py-2 px-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {visibleProductos.map((p) => {
              const categoria = categorias.find((c) => c.id === p.idCategoria);
              const isEditing = editId === p.id;

              return (
                <tr key={p.id} className="border-b hover:bg-slate-50">

                  <td className="py-3 px-3">
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      className="h-12 w-12 object-contain rounded border bg-white"
                    />
                  </td>

                  <td className="px-3">
                    {isEditing ? (
                      <input
                        name="nombre"
                        value={formEdit.nombre}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      p.nombre
                    )}
                  </td>

                  <td className="px-3 max-w-xs">
                    {isEditing ? (
                      <textarea
                        name="descripcion"
                        value={formEdit.descripcion}
                        onChange={handleEditChange}
                        rows={2}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="text-slate-700 line-clamp-2">{p.descripcion}</span>
                    )}
                  </td>

                  <td className="px-3">
                    {isEditing ? (
                      <input
                        name="marca"
                        value={formEdit.marca}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      p.marca
                    )}
                  </td>

                  <td className="px-3">
                    {isEditing ? (
                      <select
                        name="idCategoria"
                        value={formEdit.idCategoria}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      >
                        {categorias.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    ) : (
                      categoria?.nombre ?? "Sin categoría"
                    )}
                  </td>

                  <td className="px-3">
                    {isEditing ? (
                      <input
                        name="precio"
                        type="number"
                        value={formEdit.precio}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      "$" + p.precio.toLocaleString()
                    )}
                  </td>

                  <td className="px-3 text-right space-x-2">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {isEditing && (
                      <>
                        <button
                          onClick={() => saveEdit(p.id)}
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

            {productos.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 gap-2">

            {/* Botón anterior */}
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

            {/* Números */}
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

            {/* Botón siguiente */}
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
      </div>

      {/* MODAL CREAR */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border p-6 relative text-slate-900">

            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>

            <form onSubmit={createProduct} className="space-y-4">

              {/* Categoría */}
              <div>
                <label className="text-xs font-semibold">Categoría</label>
                <select
                  name="idCategoria"
                  value={createForm.idCategoria}
                  onChange={handleCreateChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Seleccione…</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label className="text-xs font-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={createForm.nombre}
                  onChange={handleCreateChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-xs font-semibold">Descripción</label>
                <textarea
                  name="descripcion"
                  value={createForm.descripcion}
                  onChange={handleCreateChange}
                  rows={2}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="text-xs font-semibold">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={createForm.marca}
                  onChange={handleCreateChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="text-xs font-semibold">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={createForm.precio}
                  onChange={handleCreateChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Nombre imagen */}
              <div>
                <label className="text-xs font-semibold">Nombre de la imagen</label>
                <input
                  type="text"
                  placeholder="ej: 5080-gaming-x.png"
                  value={createForm.nombreImagen}
                  name="nombreImagen"
                  onChange={handleCreateChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* URL generada */}
              <div className="mt-3 p-3 bg-slate-100 rounded text-xs text-slate-700">
                <strong>URL generada:</strong>

                <div className="break-all mt-1 text-slate-900">
                  {createForm.idCategoria && createForm.nombreImagen
                    ? (() => {
                        const cat = categorias.find(
                          (c) => c.id === Number(createForm.idCategoria)
                        );
                        return cat
                          ? `${endpointBucket}/${cat.nombreDirectorio}${createForm.nombreImagen}`
                          : "(Directorio no encontrado)";
                      })()
                    : "(Seleccione categoría e ingrese nombre)"}
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded font-semibold"
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