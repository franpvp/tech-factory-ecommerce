import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Nuestros Productos",
    subtitle: "al mejor precio",
    image: "/assets/hero-gpu-1.jpg",
  },
  {
    id: 2,
    title: "Hardware de alto rendimiento",
    subtitle: "para tu setup gamer",
    image: "/assets/hero-gpu-2.jpg",
  },
  {
    id: 3,
    title: "Ofertas especiales",
    subtitle: "en GPUs y procesadores",
    image: "/assets/hero-gpu-3.jpg",
  },
];

const Home = () => {
  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_PRODUCTOS;

  const [current, setCurrent] = useState(0);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(endpointProductos, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Error al obtener productos");

        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* SLIDER */}
        <section className="w-full mt-[64px]">
          <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden">
            <img
              src={slides[current].image}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-28 max-w-4xl">
              <p className="uppercase tracking-[0.25em] text-orange-300 mb-2 text-xs md:text-sm">
                Tech Factory
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                {slides[current].title}
                <br />
                <span className="text-orange-400">{slides[current].subtitle}</span>
              </h2>
            </div>

            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg"
            >
              {"<"}
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg"
            >
              {">"}
            </button>
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="mt-10">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Productos destacados</h3>

            {loading && (
              <p className="text-center text-slate-600">Cargando productos...</p>
            )}

            {!loading && productos.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productos.map((producto) => (
                  <article
                    key={producto.id}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
                    onClick={() => navigate(`/producto/${producto.id}`)}
                  >
                    <div className="h-40 bg-white flex items-center justify-center p-3">
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {producto.nombre}
                      </h4>

                      <p className="text-xs text-slate-500 mb-3">
                        {producto.descripcion}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-base font-bold text-orange-500">
                          ${producto.precio.toLocaleString()}
                        </span>

                        <button
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              idProducto: producto.id,
                              nombre: producto.nombre,
                              precio: producto.precio,
                              imagenUrl: producto.imagenUrl,
                            });
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

            {!loading && productos.length === 0 && (
              <p className="text-center text-slate-600">No hay productos disponibles.</p>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 mt-16 py-10 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-orange-400 text-lg font-bold">Tech Factory</h3>
            <p className="text-sm mt-2 text-slate-400">
              Hardware de alto rendimiento al mejor precio.
              Armamos tu setup gamer o profesional.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-orange-400 transition cursor-pointer">Inicio</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Productos</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Carrito</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Contacto</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: soporte@techfactory.cl</li>
              <li>Teléfono: +56 9 1234 5678</li>
              <li>Horario: Lunes a Sábado 10:00 - 20:00</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-10">
          © {new Date().getFullYear()} Tech Factory — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Home;