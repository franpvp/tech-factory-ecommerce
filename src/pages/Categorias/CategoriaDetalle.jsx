import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

export default function CategoriaDetalle() {

  const { categoria } = useParams();
  const navigate = useNavigate();

  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_PRODUCTOS;
  const endpointCategorias = import.meta.env.VITE_API_CATEGORIAS;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normaliza (convierte "TARJETAS GRAFICAS" → "tarjetas-graficas")
  const normalizar = (valor) => {
    return valor?.toLowerCase().replaceAll(" ", "-") ?? "";
  };

  // Alias para soportar URLs alternativas
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

      console.log("🟧 URL buscada:", categoriaURLFinal);

      // Filtrar productos según categoría
      const filtrado = productosConCategoria.filter((p) => {
        const catP = normalizar(p.categoriaNombre);

        console.log("🟦 Producto:", p.nombre, "| cat normalizada:", catP);

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
          <p className="text-center text-slate-500">Cargando...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-slate-500">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-2xl shadow border border-slate-200 hover:-translate-y-1 transition flex flex-col cursor-pointer"
                onClick={() => navigate(`/producto/${p.id}`)}
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
                      onClick={(e) => {
                        e.stopPropagation();  
                      }}
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