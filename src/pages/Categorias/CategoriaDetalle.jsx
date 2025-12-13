import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import SkeletonCard from "../../components/Skeleton/SkeletonCard";
import { useCart } from "../../context/CartContext";

export default function CategoriaDetalle() {
  const { categoria } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

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
        fetch(endpointCategorias),
      ]);

      const productosData = JSON.parse(await resProductos.text());
      const categoriasData = JSON.parse(await resCategorias.text());

      const mapaCategorias = {};
      categoriasData.forEach((cat) => {
        mapaCategorias[cat.id] = cat.nombre;
      });

      const productosConCategoria = productosData.map((p) => ({
        ...p,
        categoriaNombre: mapaCategorias[p.idCategoria] || "",
      }));

      const categoriaURL = categoria.toLowerCase();
      const categoriaURLFinal = aliasCategorias[categoriaURL] || categoriaURL;

      const filtrado = productosConCategoria.filter((p) => {
        const catP = normalizar(p.categoriaNombre);
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
          <p className="text-center text-slate-500">
            No hay productos en esta categoría.
          </p>
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
                    className="h-full w-full object-contain transition-transform duration-300"
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

                  {/* Precio + Botones */}
                  <div className="flex flex-col gap-3 mt-4">

                    {/* Precio */}
                    <span className="text-lg font-bold text-orange-600">
                      ${p.precio.toLocaleString()}
                    </span>

                    {/* Botón AGREGAR */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          idProducto: p.id,
                          nombre: p.nombre,
                          precio: p.precio,
                          imagenUrl: p.imagenUrl,
                          cantidad: 1,
                        });
                      }}
                      className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold 
                                hover:bg-slate-800 active:scale-95 transition"
                    >
                      Agregar al carrito
                    </button>

                    {/* Botón COMPRAR AHORA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        addToCart({
                          idProducto: p.id,
                          nombre: p.nombre,
                          precio: p.precio,
                          imagenUrl: p.imagenUrl,
                          cantidad: 1,
                        });

                        navigate("/carrito");
                      }}
                      className="w-full border border-orange-600 text-orange-600 py-2 rounded-xl 
                                text-sm font-semibold hover:bg-orange-50 active:scale-95 transition"
                    >
                      Comprar ahora
                    </button>

                  </div>
                </div>

                {/* Barra visual */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-300"></div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}