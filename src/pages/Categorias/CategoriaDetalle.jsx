import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

export default function CategoriaDetalle() {
  const { categoria } = useParams();
  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_PRODUCTOS;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizar = (valor) => {
    if (!valor) return "";

    if (typeof valor === "string") {
      return valor.toLowerCase().replaceAll(" ", "-");
    }

    if (typeof valor === "object" && valor.nombre) {
      return valor.nombre.toLowerCase().replaceAll(" ", "-");
    }

    return "";
  };

  const fetchProductos = async () => {
    try {
      const res = await fetch(endpointProductos, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();

      const categoriaURL = categoria.toLowerCase();

      const filtrado = data.filter((p) => {
        const catNormalizada = normalizar(p.categoria);
        return catNormalizada.includes(categoriaURL);
      });

      setProductos(filtrado);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [categoria]);

  const titulo = categoria.replace("-", " ").toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-bold mb-6">{titulo}</h1>

        {loading ? (
          <p className="text-center text-slate-500">Cargando...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-slate-500">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-2xl shadow border border-slate-200 hover:-translate-y-1 transition flex flex-col"
              >
                <div className="h-40 bg-white flex items-center justify-center">
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold text-slate-900">{p.nombre}</h3>
                  <p className="text-sm text-slate-500">{p.descripcion}</p>

                  <div className="flex justify-between mt-2">
                    <span className="font-bold text-orange-600">
                      ${p.precio.toLocaleString()}
                    </span>

                    <button
                      className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-700"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}