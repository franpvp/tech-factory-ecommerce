import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// ========================
// Helpers
// ========================

// Convierte el nombre de categoría en slug para carpeta S3
const slugCategoria = (slug) => `${slug}-img`;

// Subir archivo a S3
async function uploadToS3(file, carpetaCategoria) {
  const bucketUrl = "https://techfactory-product-images.s3.amazonaws.com";
  const fileName = `${carpetaCategoria}/${Date.now()}-${file.name}`;

  await fetch(`${bucketUrl}/${fileName}`, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return `${bucketUrl}/${fileName}`;
}

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [editId, setEditId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    marca: "",
    precioUnitario: "",
    imagenUrl: "",
    rutaImagen: "",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    marca: "",
    precioUnitario: "",
    file: null, // NUEVO: archivo de imagen
  });

  // Construye la URL final para mostrar imágenes
  const buildImageUrl = (producto) => {
    if (!producto.imagenUrl) return "";
    const base = producto.imagenUrl.replace(/\/$/, "");
    const path = (producto.rutaImagen || "").replace(/^\//, "");
    return path ? `${base}/${path}` : base;
  };

  useEffect(() => {
    setCategorias([
      { id: 1, nombre: "Tarjetas de Video (AMD / NVIDIA)", slug: "tarjetas-video" },
      { id: 2, nombre: "Procesadores", slug: "procesadores" },
      { id: 3, nombre: "Almacenamiento (SSD / NVMe)", slug: "almacenamiento" },
      { id: 4, nombre: "Fuentes de Poder", slug: "fuentes-poder" },
      { id: 5, nombre: "Memorias RAM", slug: "ram" },
      { id: 6, nombre: "Refrigeración", slug: "refrigeracion" },
    ]);

    setProductos([]); // limpio de ejemplo o uses tu backend
  }, []);

  // =====================================
  // EDICIÓN
  // =====================================
  const startEdit = (p) => {
    setEditId(p.id);
    setFormEdit({
      idCategoria: p.categoria.id,
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      marca: p.marca || "",
      precioUnitario: p.precioUnitario,
      imagenUrl: p.imagenUrl,
      rutaImagen: p.rutaImagen,
    });
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === editId
          ? {
              ...p,
              categoria: categorias.find(
                (c) => c.id === Number(formEdit.idCategoria)
              ),
              nombre: formEdit.nombre,
              descripcion: formEdit.descripcion,
              marca: formEdit.marca,
              precioUnitario: Number(formEdit.precioUnitario),
              imagenUrl: formEdit.imagenUrl,
              rutaImagen: formEdit.rutaImagen,
            }
          : p
      )
    );
    setEditId(null);
  };

  const cancelEdit = () => setEditId(null);

  // =====================================
  // NUEVO PRODUCTO (con subida S3)
  // =====================================
  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const createProduct = async (e) => {
    e.preventDefault();

    try {
      const categoriaObj = categorias.find(
        (c) => c.id === Number(createForm.idCategoria)
      );

      if (!categoriaObj) {
        alert("Seleccione una categoría válida");
        return;
      }

      if (!createForm.file) {
        alert("Debe seleccionar una imagen");
        return;
      }

      // Carpeta según categoría
      const carpeta = slugCategoria(categoriaObj.nombre);

      // Subir imagen real a S3
      const fullUrl = await uploadToS3(createForm.file, carpeta);

      // Base + ruta
      const base = "https://techfactory-product-images.s3.amazonaws.com";
      const ruta = fullUrl.replace(base, "");

      const newId =
        productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;

      const newProduct = {
        id: newId,
        categoria: categoriaObj,
        nombre: createForm.nombre,
        descripcion: createForm.descripcion,
        marca: createForm.marca,
        precioUnitario: Number(createForm.precioUnitario),
        imagenUrl: base,
        rutaImagen: ruta,
      };

      setProductos((prev) => [...prev, newProduct]);

      // Reset
      setCreateForm({
        idCategoria: "",
        nombre: "",
        descripcion: "",
        marca: "",
        precioUnitario: "",
        file: null,
      });

      setCreateOpen(false);
    } catch (error) {
      console.error("Error creando producto:", error);
      alert("Error al subir la imagen a S3");
    }
  };

  // Eliminar producto
  const deleteProduct = (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  // =====================================
  // RENDER
  // =====================================
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Gestión de Productos
        </h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-orange-500 active:scale-95 transition"
        >
          + Nuevo producto
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
        {/* ... TU TABLA EXACTA ... */}
        (todo tu código de tabla queda igual)
      </div>

      {/* MODAL CREAR PRODUCTO */}
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
              Nuevo Producto
            </h2>

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
                  name="precioUnitario"
                  value={createForm.precioUnitario}
                  onChange={handleCreateChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Imagen */}
              <div>
                <label className="text-xs font-semibold">
                  Imagen del producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      file: e.target.files[0],
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Botones */}
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