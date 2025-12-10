import React, { useEffect, useMemo } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";

export default function ConfirmacionCompra() {
  const navigate = useNavigate();
  const { clearCart } = useCart?.() || { clearCart: () => {} };

  // Recibir orden desde navigate(... { state: { orden } })
  const { state } = useLocation();
  const orden = state?.orden;

  // Si alguien entra directo sin datos → volver al home
  useEffect(() => {
    if (!orden) {
      navigate("/");
    }
  }, [orden, navigate]);

  // Extraer detalles reales desde el backend
  const listaDetalle = orden?.listaDetalle || [];

  // Calcular totales reales
  const { total, cantidad } = useMemo(() => {
    const totalCalc = listaDetalle.reduce((acc, d) => acc + d.subtotal, 0);
    const cant = listaDetalle.reduce((acc, d) => acc + d.cantidad, 0);
    return { total: totalCalc, cantidad: cant };
  }, [listaDetalle]);

  // Limpiar carrito cuando se carga
  useEffect(() => {
    clearCart?.();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 px-4 flex justify-center">
        <div className="bg-white shadow-xl border border-slate-200 p-8 rounded-2xl w-full max-w-3xl animate-fadeIn">

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              ¡Compra realizada con éxito!
            </h1>
            <p className="mt-2 text-slate-600 max-w-md">
              Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando para despacho.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-700 border border-slate-200">
              <span className="font-semibold">N° de orden:</span>
              <span className="font-mono text-orange-600">{orden?.idOrden}</span>
            </div>
          </div>

          {/* RESUMEN PRINCIPAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">
                Resumen de la compra
              </h2>

              <div className="flex justify-between text-sm mb-1">
                <span>Productos</span>
                <span>{cantidad}</span>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span>Envío</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                <span>Total pagado</span>
                <span className="text-orange-600">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">
                Estado del pedido
              </h2>
              <p className="text-sm text-slate-600 mb-2">
                Tu pedido está actualmente:
              </p>

              <p className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                En preparación
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Recibirás un correo con la confirmación y detalles del despacho.
              </p>
            </div>
          </div>

          {/* LISTA DE PRODUCTOS */}
          {listaDetalle.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Productos de tu pedido
              </h2>

              <div className="space-y-3">
                {listaDetalle.map((item) => (
                  <div
                    key={item.idDetalleOrden}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3"
                  >
                    <img
                      src={item.producto.imagenUrl}
                      alt={item.producto.nombre}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.producto.nombre}
                      </p>

                      <p className="text-xs text-slate-500">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-800">
                      ${item.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTONES */}
          <div className="flex flex-col md:flex-row gap-3 md:justify-between mt-4">
            <button
              onClick={() => navigate("/")}
              className="w-full md:w-auto bg-orange-600 hover:bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold active:scale-95 transition text-center"
            >
              Seguir comprando
            </button>

            <button
              onClick={() => navigate("/perfil")}
              className="w-full md:w-auto border border-slate-300 text-slate-700 hover:bg-slate-50 py-3 px-6 rounded-xl font-semibold transition text-center"
            >
              Ver mis pedidos
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}