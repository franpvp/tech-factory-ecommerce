import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";

// Slides de ejemplo (cambia las rutas de las imágenes por las tuyas)
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

// productos de ejemplo para las cards
const products = [
  { id: 1, name: "RTX 4060 Ti", price: "$399.990" },
  { id: 2, name: "RTX 4070 Super", price: "$649.990" },
  { id: 3, name: "Ryzen 7 7800X3D", price: "$529.990" },
  { id: 4, name: "Ryzen 9 7950X", price: "$799.990" },
  { id: 5, name: "Fuente 850W Gold", price: "$129.990" },
  { id: 6, name: "Gabinete RGB", price: "$89.990" },
  { id: 7, name: "Kit ventiladores ARGB", price: "$59.990" },
  { id: 8, name: "SSD NVMe 2TB", price: "$189.990" },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[current];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* NAVBAR */}
      <Navbar />

      <main className="pt-[80px] pb-16">
        <section className="w-full">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="relative overflow-hidden rounded-[32px] bg-black border border-slate-900 shadow-[0_18px_40px_rgba(0,0,0,0.6)] mt-6">
              <div className="relative h-[260px] md:h-[320px] lg:h-[360px]">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />

                <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
                  <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-orange-300/90 mb-1">
                    Tech Factory
                  </p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-orange-200 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                    {currentSlide.title}
                    <br />
                    <span className="text-orange-400">
                      {currentSlide.subtitle}
                    </span>
                  </h2>
                  <p className="mt-3 text-sm md:text-base max-w-md text-slate-100/90">
                    Arma tu setup con GPUs, procesadores y componentes de alto
                    rendimiento al mejor precio del mercado.
                  </p>
                </div>

                {/* Flechas */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md hover:bg-slate-100 active:scale-95 transition"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md hover:bg-slate-100 active:scale-95 transition"
                >
                  &gt;
                </button>

                {/* Puntos */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrent(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        current === index
                          ? "w-6 bg-orange-400"
                          : "w-2.5 bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CARDS DE PRODUCTOS */}
        <section className="mt-10">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-semibold">
                Productos destacados
              </h3>
              <button className="hidden md:inline-flex text-xs font-semibold px-4 py-2 rounded-full bg-slate-900 text-slate-50 border border-slate-800 hover:bg-slate-800 active:scale-95 transition">
                Ver todo el catálogo
              </button>
            </div>

            {/* Grid de productos: 1 en mobile, 2 en tablet, 3 en desktop */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.35)] transition-transform"
                >
                  <div className="h-36 md:h-40 bg-slate-200 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Imagen producto
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-semibold mb-1 text-slate-900">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Componentes de alto rendimiento para tu PC gamer.
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-base font-bold text-orange-500">
                        {product.price}
                      </span>
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition">
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition"
          aria-label="Contactar por WhatsApp"
        >
          <span className="text-2xl"></span>
        </button>
      </main>
    </div>
  );
};

export default Home;