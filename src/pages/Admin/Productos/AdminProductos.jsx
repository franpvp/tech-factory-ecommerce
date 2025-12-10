import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { getCategorias } from "../../../services/CategoriasService";

export default function AdminProductos() {
  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;
  const endpointBucket = import.meta.env.VITE_BUCKET;

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    marca: "",
    precio: "",
    imagenUrl: "",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    marca: "",
    precio: "",
    nombreImagen: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Backend trae id, nombre, descripcion, nombreDirectorio
        const categoriasBD = await getCategorias();
        setCategorias(categoriasBD);

        // Cargar productos
        fetch(endpointProductos)
          .then((r) => r.json())
          .then(setProductos)
          .catch(() => console.error("Error cargando productos"));
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    loadData();
  }, []);

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const createProduct = async (e) => {
    e.preventDefault();

    try {
      const categoria = categorias.find(
        (c) => c.id === Number(createForm.idCategoria)
      );

      if (!categoria) {
        alert("Categoría no encontrada");
        return;
      }

      const carpeta = categoria.nombreDirectorio; // EJ: "tarjetas-graficas-img/"

      const imagenUrl = `${endpointBucket}/${carpeta}${createForm.nombreImagen}`;

      const payload = {
        idCategoria: Number(createForm.idCategoria),
        nombre: createForm.nombre,
        descripcion: createForm.descripcion,
        marca: createForm.marca,
        precio: Number(createForm.precio),
        imagenUrl: imagenUrl,
      };

      console.log("PAYLOAD ENVIADO:", payload);

      const res = await fetch(endpointProductos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error creando producto");

      const nuevoProducto = await res.json();
      setProductos((prev) => [...prev, nuevoProducto]);
      setCreateOpen(false);
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Error al crear producto");
    }
  };

  return (
    <div className="text-slate-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-orange-500"
        >
          + Nuevo producto
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b font-semibold">
              <th className="py-2">Imagen</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Marca</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Precio</th>
              <th className="py-2 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => {
              const categoria = categorias.find((c) => c.id === p.idCategoria);

              return (
                <tr key={p.id} className="border-b">
                  <td className="py-3">
                    <img
                      src={p.imagenUrl}
                      alt={p.nombre}
                      className="h-12 w-12 object-contain rounded"
                    />
                  </td>

                  <td>{p.nombre}</td>
                  <td>{p.marca}</td>

                  <td>{categoria?.nombre ?? "Sin categoría"}</td>

                  <td>${p.precio.toLocaleString()}</td>

                  <td className="text-right">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {productos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR PRODUCTO */}
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