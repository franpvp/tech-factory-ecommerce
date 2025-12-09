import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Carrito() {
  const navigate = useNavigate();
  const { cart, deleteFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const envio = 4990; // 💰 COSTO DE ENVÍO
  const subtotal = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const totalFinal = subtotal + envio; // 🔥 TOTAL CORRECTO

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-5xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          🛒 Mi Carrito
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-slate-500">Tu carrito está vacío</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LISTA DE PRODUCTOS */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.idProducto}
                  className="flex bg-white rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={item.imagenUrl}
                    className="w-32 h-32 object-cover border-r"
                  />

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <h3 className="font-semibold">{item.nombre}</h3>

                    <p className="text-sm font-bold text-orange-600 mt-3">
                      ${item.precio.toLocaleString()}
                    </p>
                  </div>

                  {/* CONTROLES DERECHA */}
                  <div className="flex flex-col justify-between items-center p-4">
                    <button
                      onClick={() => deleteFromCart(item.idProducto)}
                      className="text-red-500 font-bold hover:text-red-700 text-xl"
                    >
                      ✕
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.idProducto)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full text-lg font-bold transition"
                      >
                        –
                      </button>

                      <span className="min-w-[32px] text-center font-semibold text-slate-900">
                        {item.cantidad}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.idProducto)}
                        className="w-8 h-8 flex items-center justify-center bg-orange-600 text-white hover:bg-orange-500 rounded-full text-lg font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RESUMEN */}
            <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>

              <div className="text-sm space-y-3">

                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span className="font-semibold">${envio.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-orange-600">
                    ${totalFinal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/despacho")}
                  className="mt-6 w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-500"
                >
                  Ir a pagar
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}