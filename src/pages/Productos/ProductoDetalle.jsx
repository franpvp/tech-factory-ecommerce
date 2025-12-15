import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";

import { msalInstance } from "../../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import "../../components/Navbar/collapse.css";

// === Skeleton Loader para Página de Producto ===
const ProductoSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
    <div className="flex flex-col gap-4">
      <div className="w-full h-[380px] bg-slate-300 rounded-3xl" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-20 h-20 bg-slate-300 rounded-xl" />
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <div className="h-8 bg-slate-300 rounded w-3/4" />
      <div className="h-6 bg-slate-300 rounded w-1/2" />
      <div className="h-4 bg-slate-300 rounded w-full" />
      <div className="h-4 bg-slate-300 rounded w-5/6" />
      <div className="h-12 bg-slate-300 rounded-xl w-1/2 mt-6" />
    </div>
  </div>
);

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [related, setRelated] = useState([]);

  const scrollRef = useRef(null);

  const obtenerToken = async () => {

       const isTestMode = import.meta.env.VITE_TEST_MODE === "true";
          if (isTestMode) {
              return "TEST_TOKEN";
            }
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) return null;

      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          account: accounts[0],
        });

        return response.accessToken;
      } catch (silentError) {
        if (silentError instanceof InteractionRequiredAuthError) {
          const popupResponse = await msalInstance.acquireTokenPopup({
            scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          });

          return popupResponse.accessToken;
        }

        throw silentError;
      }
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;

    async function fetchProducto() {
      try {
        const token = await obtenerToken();

        const res = await fetch(`${endpoint}/${id}`);

        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        setProducto(data);
        setImagenSeleccionada(data.imagenUrl);
      } catch (error) {
        setProducto(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id]);

  useEffect(() => {
    if (!producto) return;

    const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;

    async function fetchRelacionados() {
      try {
        const token = await obtenerToken();

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No se pudo obtener productos relacionados");

        const all = await res.json();

        const filtrados = all.filter(
          (p) =>
            p.idCategoria === producto.idCategoria &&
            p.id !== producto.id
        );

        setRelated(filtrados.slice(0, 10));
      } catch (e) {
        console.error("Error cargando productos relacionados:", e);
      }
    }

    fetchRelacionados();
  }, [producto]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-20">
          <ProductoSkeleton />
        </main>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-600 font-semibold text-lg">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-20">

        {/* PRODUCTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Imagen principal + miniaturas */}
          <div className="flex flex-col gap-4">
            <div className="w-full h-[420px] rounded-3xl overflow-hidden shadow-lg border bg-white flex items-center justify-center">
              <img
                src={imagenSeleccionada}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Miniaturas */}
            <div className="flex gap-3">
              {[producto.imagenUrl, ...(producto.imagenesExtras || [])].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setImagenSeleccionada(img)}
                  className={`w-20 h-20 rounded-xl object-cover border cursor-pointer transition 
                    ${
                      imagenSeleccionada === img
                        ? "ring-2 ring-orange-600"
                        : "hover:ring-2 hover:ring-orange-400"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold">{producto.nombre}</h1>

              <p className="text-orange-600 text-4xl font-black mt-4">
                ${producto.precio.toLocaleString()}
              </p>

              <p className="text-slate-600 mt-6 leading-relaxed text-lg">
                {producto.descripcion}
              </p>

              {/* Etiquetas */}
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">
                  {producto.marca || "TechFactory"}
                </span>
                <span className="bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full">
                  Garantía 6 meses
                </span>
              </div>
            </div>

            {/* Botón agregar */}
            <div className="mt-8 flex flex-col gap-3">
              {/* AGREGAR AL CARRITO */}
              <button
                onClick={() =>
                  addToCart({
                    idProducto: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagenUrl: producto.imagenUrl,
                    cantidad: 1,
                  })
                }
                className="bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold 
                          hover:bg-orange-500 active:scale-[0.98] transition"
              >
                Agregar al carrito
              </button>

              {/* COMPRAR AHORA */}
              <button
                onClick={() => {
                  addToCart({
                    idProducto: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagenUrl: producto.imagenUrl,
                    cantidad: 1,
                  });
                  navigate("/carrito");
                }}
                className="border border-orange-600 text-orange-600 py-3 rounded-xl 
                          text-lg font-semibold hover:bg-orange-50 active:scale-[0.98] transition"
              >
                Comprar ahora
              </button>

          </div>
          </div>

        </div>

        {/* RELACIONADOS */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4" ref={scrollRef}>
            {related.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/producto/${item.id}`)}
                className="min-w-[240px] bg-white rounded-2xl shadow-md border hover:shadow-lg cursor-pointer 
                           overflow-hidden transition"
              >
                <img
                  src={item.imagenUrl}
                  className="h-40 w-full object-contain bg-white p-2"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {item.nombre}
                  </h3>

                  <p className="text-orange-600 font-bold mt-2 text-lg">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-300" />
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}