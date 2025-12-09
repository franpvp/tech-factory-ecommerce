import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const endpointProductos = import.meta.env.VITE_SERVICE_ENDPOINT_PRODUCTOS;

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("descripcion");
  const [selectedImg, setSelectedImg] = useState("");

  const fetchProducto = async () => {
    try {
      const res = await fetch(`${endpointProductos}/${id}`);
      const data = await res.json();

      setProducto(data);
      setSelectedImg(data.imagenUrl);

      const rel = await fetch(endpointProductos);
      const all = await rel.json();
      setRelacionados(all.filter((p) => p.idProducto !== Number(id)).slice(0, 4));

    } catch (e) {
      console.error("Error cargando producto:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!producto) return <p className="text-center mt-20">Producto no encontrado</p>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[100px] max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="w-full h-80 bg-white rounded-2xl shadow-lg border flex items-center justify-center p-4">
              <img
                src={selectedImg}
                className="max-w-full max-h-full object-contain cursor-zoom-in"
              />
            </div>

            {/* MINIATURAS */}
            <div className="flex gap-3">
              {[producto.imagenUrl, ...(producto.imagenesExtra || [])].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-xl border cursor-pointer object-cover
                    ${selectedImg === img ? "ring-2 ring-orange-500" : "opacity-70 hover:opacity-100"}
                  `}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">

            <h1 className="text-2xl font-bold">{producto.nombre}</h1>

            <p className="mt-2 text-slate-600">{producto.descripcion}</p>

            <div className="mt-6 text-3xl font-bold text-orange-600">
              ${producto.precio.toLocaleString()}
            </div>

            <button
              className="mt-6 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition active:scale-95"
              onClick={() =>
                addToCart({
                  idProducto: producto.idProducto,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagenUrl: producto.imagenUrl
                })
              }
            >
              Agregar al carrito
            </button>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg border p-6">

          {/* TABS HEADER */}
          <div className="flex gap-6 border-b pb-3">
            {["descripcion", "specs", "garantia"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`
                  pb-2 capitalize font-medium
                  ${tab === t ? "text-orange-600 border-b-2 border-orange-600" : "text-slate-500"}
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {/* TABS CONTENT */}
          <div className="mt-6 text-slate-700 leading-relaxed">

            {tab === "descripcion" && (
              <p>{producto.descripcionLarga || "No hay una descripción extendida disponible."}</p>
            )}

            {tab === "specs" && (
              <ul className="list-disc pl-6 space-y-1">
                {(producto.especificaciones || ["Sin especificaciones"]).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}

            {tab === "garantia" && (
              <p>Todos nuestros productos cuentan con garantía legal de 6 meses.</p>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Productos relacionados</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((p) => (
              <article
                key={p.idProducto}
                className="bg-white rounded-2xl border shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
                onClick={() => window.location.href = `/producto/${p.idProducto}`}
              >
                <div className="h-36 bg-white flex justify-center items-center p-3">
                  <img src={p.imagenUrl} className="max-h-full object-contain" />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold">{p.nombre}</h3>
                  <p className="text-orange-600 font-bold mt-2">
                    ${p.precio.toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}