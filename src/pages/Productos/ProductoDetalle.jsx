import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";
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

  const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_PRODUCTOS; 
  useEffect(() => {
    async function fetchProducto() {
      try {
        const res = await fetch(`${endpoint}/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();

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

  // =======================================
  // 2. FETCH DE PRODUCTOS RELACIONADOS
  // =======================================
  useEffect(() => {
    async function fetchRelacionados() {
      try {
        const res = await fetch(endpoint);
        const all = await res.json();

        if (!producto) return;

        // Relacionados → misma categoría, distinto ID
        const filtrados = all.filter(
          (p) => p.idCategoria === producto.idCategoria && p.id !== producto.id
        );

        setRelated(filtrados.slice(0, 10)); // muestra máximo 10
      } catch (e) {
        console.error("Error cargando relacionados:", e);
      }
    }

    if (producto) fetchRelacionados();
  }, [producto]);

  // =======================================
  // 3. AUTO-SLIDER MINI
  // =======================================
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    slider.paused = false;

    const interval = setInterval(() => {
      if (slider.paused) return;

      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft + 250 >= maxScroll) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 250, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // =======================================
  // 4. ESTADOS DE CARGA / ERROR
  // =======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center pt-24">
        <p className="text-slate-600">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center pt-24">
        <p className="text-red-600 font-semibold">Producto no encontrado</p>
      </div>
    );
  }

  // =======================================
  // 5. RENDER PRINCIPAL
  // =======================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-20">
        {/* CONTENEDOR PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* IMAGEN PRINCIPAL */}
          <div className="flex flex-col gap-4">
            <img
              src={imagenSeleccionada}
              alt={producto.nombre}
              className="w-full h-[380px] object-cover rounded-3xl shadow-lg border"
            />

            <div className="flex gap-3">
              {[producto.imagenUrl, ...(producto.imagenesExtras || [])].map(
                (img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setImagenSeleccionada(img)}
                    className={`w-20 h-20 rounded-xl object-cover border cursor-pointer transition 
                      ${
                        imagenSeleccionada === img
                          ? "ring-2 ring-orange-500"
                          : "hover:ring-2 hover:ring-orange-500"
                      }`}
                  />
                )
              )}
            </div>
          </div>

          {/* INFO PRODUCTO */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                {producto.nombre}
              </h1>

              <p className="text-orange-600 text-3xl font-extrabold mb-4">
                ${producto.precio.toLocaleString()}
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex flex-col gap-3">
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
                className="w-full bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-orange-500 active:scale-95 transition shadow-md"
              >
                Agregar al carrito 🛒
              </button>

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
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-lg font-semibold hover:bg-slate-800 active:scale-95 transition shadow-md"
              >
                Comprar ahora ⚡
              </button>
            </div>
          </div>
        </div>

        {/* ESPECIFICACIONES */}
        <section className="mt-14 bg-white rounded-3xl shadow-lg border p-8">
          <h2 className="text-xl font-bold mb-4">Especificaciones</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {(producto.specs || ["Sin especificaciones disponibles"]).map(
              (s, i) => (
                <li key={i}>{s}</li>
              )
            )}
          </ul>
        </section>

        {/* RELACIONADOS */}
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-4">Productos relacionados</h2>

          <div
            className="relative"
            onMouseEnter={() => (scrollRef.current.paused = true)}
            onMouseLeave={() => (scrollRef.current.paused = false)}
          >
            <button
              onClick={() =>
                scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
              }
              className="slider-arrow absolute left-0 top-1/2 -translate-y-1/2 
                         rounded-full w-12 h-12 flex items-center justify-center z-20 text-xl"
            >
              ‹
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-2 py-4"
            >
              {related.map((item) => (
                <div
                  key={item.id}
                  className="product-card-related min-w-[260px] overflow-hidden"
                >
                  <img src={item.imagenUrl} className="h-40 w-full object-cover" />

                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{item.nombre}</h3>
                    <p className="text-orange-600 font-bold text-lg mb-3">
                      ${item.precio.toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        addToCart({
                          idProducto: item.id,
                          nombre: item.nombre,
                          precio: item.precio,
                          imagenUrl: item.imagenUrl,
                          cantidad: 1,
                        })
                      }
                      className="btn-related-add w-full py-2 rounded-xl text-sm font-semibold shadow-md"
                    >
                      Agregar al carrito 🛒
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
              }
              className="slider-arrow absolute right-0 top-1/2 -translate-y-1/2 
                         rounded-full w-12 h-12 flex items-center justify-center z-20 text-xl"
            >
              ›
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}