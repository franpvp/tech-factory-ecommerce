import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";

import { msalInstance } from "../../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import "../../components/Navbar/collapse.css";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [related, setRelated] = useState([]);

  const scrollRef = useRef(null);


  // ======================================================
  // TOKEN EXACTAMENTE COMO RegistrarClienteService
  // ======================================================
  const obtenerToken = async () => {

    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        console.warn("No hay cuentas activas en MSAL.");
        return null;
      }

      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          account: accounts[0],
        });

        console.log("TOKEN (silent):", response.accessToken);
        return response.accessToken;

      } catch (silentError) {
        if (silentError instanceof InteractionRequiredAuthError) {
          console.log("Se requiere popup para obtener token.");

          const popupResponse = await msalInstance.acquireTokenPopup({
            scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          });

          console.log("TOKEN (popup):", popupResponse.accessToken);
          return popupResponse.accessToken;
        }

        throw silentError;
      }

    } catch (err) {
      console.error("Error obteniendo token:", err);
      return null;
    }
  };

  // ======================================================
  // 1. FETCH PRODUCTO (con token)
  // ======================================================
  useEffect(() => {
    const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_PRODUCTOS;
    async function fetchProducto() {
      try {
        const token = await obtenerToken();

        const res = await fetch(`${endpoint}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        console.log("PRODUCTO:", data);

        setProducto(data);
        setImagenSeleccionada(data.imagenUrl);

      } catch (error) {
        console.error("Error cargando producto:", error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
  }, [id]);

  // ======================================================
  // 2. FETCH RELACIONADOS (también con token)
  // ======================================================
  useEffect(() => {
    async function fetchRelacionados() {
      try {
        const token = await obtenerToken();

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const all = await res.json();

        if (!producto) return;

        const filtrados = all.filter(
          (p) =>
            p.idCategoria === producto.idCategoria &&
            p.idProducto !== producto.idProducto
        );

        setRelated(filtrados.slice(0, 10));

      } catch (e) {
        console.error("Error cargando productos relacionados:", e);
      }
    }

    if (producto) fetchRelacionados();
  }, [producto]);


  // ======================================================
  // 3. LOADING & ERROR
  // ======================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-600 font-semibold">Producto no encontrado</p>
      </div>
    );
  }

  // ======================================================
  // 4. UI PRINCIPAL
  // ======================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-20">

        {/* PRODUCTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Imagen */}
          <div className="flex flex-col gap-4">
            <img
              src={imagenSeleccionada}
              className="w-full h-[380px] rounded-3xl object-cover border shadow-lg"
            />

            <div className="flex gap-3">
              {[producto.imagenUrl, ...(producto.imagenesExtras || [])].map(
                (img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setImagenSeleccionada(img)}
                    className={`w-20 h-20 object-cover rounded-xl border cursor-pointer ${
                      imagenSeleccionada === img
                        ? "ring-2 ring-orange-600"
                        : "hover:ring-2 hover:ring-orange-600"
                    }`}
                  />
                )
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold">{producto.nombre}</h1>

              <p className="text-orange-600 text-3xl font-extrabold mt-2">
                ${producto.precio.toLocaleString()}
              </p>

              <p className="text-slate-600 mt-4">{producto.descripcion}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() =>
                  addToCart({
                    idProducto: producto.idProducto,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagenUrl: producto.imagenUrl,
                    cantidad: 1,
                  })
                }
                className="bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-orange-500"
              >
                Agregar al carrito
              </button>
            </div>
          </div>

        </div>

        {/* RELACIONADOS */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-3">Productos relacionados</h2>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4" ref={scrollRef}>
            {related.map((item) => (
              <div
                key={item.idProducto}
                className="min-w-[260px] bg-white rounded-xl shadow border"
              >
                <img src={item.imagenUrl} className="h-40 w-full object-cover" />

                <div className="p-4">
                  <h3 className="font-semibold text-sm">{item.nombre}</h3>
                  <p className="text-orange-600 font-bold mt-2">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}