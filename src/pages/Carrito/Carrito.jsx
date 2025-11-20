import React from "react";
import Navbar from "../../components/Navbar/Navbar";

// Imagenes
import img5090 from "../../assets/img/5090.jpg";

export default function Carrito() {
  const items = [
    {
      id: 1,
      name: "RTX 5090 Gaming Trio",
      price: 399990,
      qty: 1,
      image: img5090,
    },
    {
      id: 2,
      name: "Ryzen 7 7800X3D",
      price: 529990,
      qty: 1,
      image: "/assets/hero-gpu-2.jpg",
    },
  ];

  const total = items.reduce((acc, p) => acc + p.price * p.qty, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-5xl mx-auto px-4">

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          🛒 Mi Carrito
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-slate-500">Tu carrito está vacío</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    className="w-32 h-32 object-cover border-r border-slate-200"
                  />
                  <div className="flex-1 p-4 flex flex-col justify-between">

                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Cantidad: {item.qty}
                      </p>
                    </div>

                    {/* SUBTOTAL */}
                    <p className="text-sm font-bold text-orange-600 mt-2">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 h-fit">

              <h2 className="text-xl font-semibold mb-4 text-slate-900">
                Resumen de compra
              </h2>

              <div className="flex justify-between text-sm mb-3 text-slate-600">
                <span>Productos:</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between text-sm mb-3 text-slate-600">
                <span>Subtotal:</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm mb-6 text-slate-600">
                <span>Envío:</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-3">
                <span>Total:</span>
                <span className="text-orange-600">${total.toLocaleString()}</span>
              </div>

              {/* BOTONES */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => navigate("/pago")}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-500 transition"
                >
                  Ir a pagar
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition active:scale-95"
                >
                  Seguir comprando
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}