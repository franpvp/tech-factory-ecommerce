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

  const scrollRef = useRef(null);

  const productosMock = [
    {
      idProducto: 1,
      nombre: "RTX 5090 Gaming Trio",
      precio: 1299990,
      descripcion:
        "La NVIDIA RTX 5090 es una GPU ultra potente para jugadores y creadores.",
      specs: ["24GB GDDR7", "18.432 CUDA", "Boost 3.2GHz", "DLSS 4.0"],
      imagenUrl:
        "https://techfactory-product-images.s3.amazonaws.com/tarjetas-graficas-img/5090.jpg",
      imagenesExtras: [
        "https://techfactory-product-images.s3.amazonaws.com/tarjetas-graficas-img/5090-1.jpg",
        "https://techfactory-product-images.s3.amazonaws.com/tarjetas-graficas-img/5090-2.jpg",
      ],
    },
  ];

  const relatedMock = [
    {
      idProducto: 5,
      nombre: "RTX 4080 Super",
      precio: 899990,
      imagenUrl:
        "https://techfactory-product-images.s3.amazonaws.com/tarjetas-graficas-img/4080.jpg",
    },
    {
      idProducto: 6,
      nombre: "Ryzen 9 7950X3D",
      precio: 679990,
      imagenUrl:
        "https://techfactory-product-images.s3.amazonaws.com/procesadores/7950x3d.jpg",
    },
    {
      idProducto: 7,
      nombre: "SSD NVMe 2TB Gen5",
      precio: 249990,
      imagenUrl:
        "https://techfactory-product-images.s3.amazonaws.com/almacenamiento/nvme2tb.jpg",
    },
    {
      idProducto: 8,
      nombre: "Fuente Corsair 1000W Gold",
      precio: 169990,
      imagenUrl:
        "https://techfactory-product-images.s3.amazonaws.com/fuentes/psu1000w.jpg",
    },
  ];

  useEffect(() => {
    const prod = productosMock.find((p) => p.idProducto == id);
    setProducto(prod);
    setImagenSeleccionada(prod?.imagenUrl);
    setLoading(false);
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24 flex justify-center items-center">
        <p className="text-slate-600">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24 flex justify-center items-center">
        <p className="text-red-600 font-semibold">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                className="w-full bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-orange-500 active:scale-95 transition shadow-md"
              >
                Agregar al carrito 🛒
              </button>

              {/* BOTÓN COMPRAR AHORA */}
              <button
                onClick={() => {
                  addToCart({
                    idProducto: producto.idProducto,
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

        <section className="mt-14 bg-white rounded-3xl shadow-lg border p-8">
          <h2 className="text-xl font-bold mb-4">Especificaciones</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {producto.specs.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
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
            {/* FLECHA IZQUIERDA */}
            <button
              onClick={() =>
                scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
              }
              className="slider-arrow absolute left-0 top-1/2 -translate-y-1/2 
                        rounded-full w-12 h-12 flex items-center justify-center z-20 text-xl"
            >
              ‹
            </button>

            {/* SLIDER */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-2 py-4"
            >
              {relatedMock.map((item) => (
                <div
                  key={item.idProducto}
                  className="product-card-related min-w-[260px] overflow-hidden"
                >
                  <img
                    src={item.imagenUrl}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{item.nombre}</h3>
                    <p className="text-orange-600 font-bold text-lg mb-3">
                      ${item.precio.toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        addToCart({
                          idProducto: item.idProducto,
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

            {/* FLECHA DERECHA */}
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