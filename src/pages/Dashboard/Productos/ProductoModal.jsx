import React, { useState, useEffect } from "react";

export default function ProductoModal({ onClose, producto, refresh }) {
  const isEdit = Boolean(producto);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    imagenUrl: "",
    descripcion: "",
  });

  const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;

  useEffect(() => {
    if (producto) setForm(producto);
  }, [producto]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!form.nombre || !form.precio || !form.stock) {
      alert("Todos los campos obligatorios deben ser completados.");
      return;
    }

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${endpoint}/${producto.idProducto}` : endpoint;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl relative">
        <button
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-5">
          {isEdit ? "Editar Producto" : "Agregar Producto"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="font-medium text-sm">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-sm">Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-sm">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-sm">Imagen (URL)</label>
            <input
              type="text"
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-sm">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            ></textarea>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-orange-600 hover:bg-orange-500 transition text-white font-semibold py-3 rounded-xl"
        >
          {isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </div>
  );
}