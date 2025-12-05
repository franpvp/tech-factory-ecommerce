import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  XCircleIcon,
  ArrowPathIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

export default function PagoFallido() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[100px] pb-16 max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">

          <div className="flex justify-center mb-6">
            <XCircleIcon className="w-24 h-24 text-red-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Pago rechazado
          </h2>

          <p className="text-slate-600 text-sm max-w-md mx-auto">
            {state?.reason ||
              "Tu pago no pudo completarse. Puede deberse a un error de conexión, fondos insuficientes o un rechazo por parte del banco."}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/metodo-pago")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 transition active:scale-95"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Reintentar pago
            </button>

            <button
              onClick={() => navigate("/carrito")}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition active:scale-95"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Ir al carrito
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-semibold hover:text-orange-600 transition active:scale-95"
            >
              <HomeIcon className="w-5 h-5" />
              Volver al inicio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}