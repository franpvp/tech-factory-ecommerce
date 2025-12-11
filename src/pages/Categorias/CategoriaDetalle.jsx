import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

import SkeletonCard from "../../components/Skeleton/SkeletonCard";

export default function CategoriaDetalle() {

  const { categoria } = useParams();
  const navigate = useNavigate();

  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;
  const endpointCategorias = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_CATEGORIAS;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizar = (valor) => {
    return valor?.toLowerCase().replaceAll(" ", "-") ?? "";
  };

  const aliasCategorias = {
    "tarjetas-video": "tarjetas-graficas",
    "tarjetas-grafica": "tarjetas-graficas",
    "video": "tarjetas-graficas",
  };

  const fetchProductos = async () => {
    try {
      const [resProductos, resCategorias] = await Promise.all([
        fetch(endpointProductos),
        fetch(endpointCategorias)
      ]);

      const rawProductos = await resProductos.text();
      const rawCategorias = await resCategorias.text();

      const productosData = JSON.parse(rawProductos);
      const categoriasData = JSON.parse(rawCategorias);

      // Crear mapa idCategoria → nombreCategoria
      const mapaCategorias = {};
      categoriasData.forEach(cat => {
        mapaCategorias[cat.id] = cat.nombre;
      });

      // Agregar nombre de categoría a cada producto
      const productosConCategoria = productosData.map(p => ({
        ...p,
        categoriaNombre: mapaCategorias[p.idCategoria] || ""
      }));

      // Normalizar categoría de URL + aplicar alias si existe
      const categoriaURL = categoria.toLowerCase();
      const categoriaURLFinal = aliasCategorias[categoriaURL] || categoriaURL;

      // Filtrar productos según categoría
      const filtrado = productosConCategoria.filter((p) => {
        const catP = normalizar(p.categoriaNombre);

        console.log("Producto:", p.nombre, "| cat normalizada:", catP);

        return catP === categoriaURLFinal;
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

  const titulo = categoria.replaceAll("-", " ").toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-bold mb-6">{titulo}</h1>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-slate-500">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden 
                          hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
                onClick={() => navigate(`/producto/${p.id}`)}
              >
                {/* Imagen */}
                <div className="h-44 bg-white flex items-center justify-center p-4">
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                    {p.nombre}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {p.descripcion}
                  </p>

                  {/* Precio + Botón */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-orange-600">
                      ${p.precio.toLocaleString()}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-full 
                                hover:bg-slate-700 active:scale-95 transition"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Barra inferior indicadora de categoría */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-300"></div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}