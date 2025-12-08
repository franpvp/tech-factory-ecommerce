import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import ProductoModal from "./ProductoModal";

export default function DashboardProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState(null);

  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_PRODUCTOS;

  const fetchProductos = async () => {
    const res = await fetch(endpointProductos);
    const data = await res.json();
    setProductos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`${endpointProductos}/${id}`, { method: "DELETE" });
    fetchProductos();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-3xl font-bold text-slate-900">
          Gestión de Productos
        </h1>

        {/* 🔥 BOTÓN CORRECTO, SUPER VISIBLE */}
        <button
          onClick={() => {
            setEditProducto(null);
            setModalOpen(true);
          }}
          className="
            flex items-center gap-2
            bg-orange-600
            text-white
            px-5 py-2
            rounded-xl
            shadow-md
            hover:bg-orange-500
            active:scale-95
            transition
          "
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>
          Agregar Producto
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3">Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.idProducto} className="border-b hover:bg-slate-50">
                  <td>
                    <img
                      src={p.imagenUrl}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td>{p.nombre}</td>
                  <td>${p.precio.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td className="text-right">
                    <button
                      className="text-blue-600 mr-3"
                      onClick={() => {
                        setEditProducto(p);
                        setModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => eliminarProducto(p.idProducto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductoModal
          onClose={() => setModalOpen(false)}
          producto={editProducto}
          refresh={fetchProductos}
        />
      )}
    </DashboardLayout>
  );
}