import React, { useState } from "react";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Pagos() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");

  const total = 929980; // Ejemplo temporal

  return (
    <div className="min-h-screen bg-slate-100 pt-24 px-4 flex justify-center">
      <div className="bg-white shadow-xl border border-slate-200 p-8 rounded-2xl w-full max-w-2xl animate-fadeIn">

        {/* Título */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Métodos de Pago
        </h1>

        {/* Métodos rápidos */}
        <div className="space-y-3 mb-6">

          {/* Apple Pay */}
          <button className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold active:scale-95 transition">
             Pay
          </button>

          {/* Google Pay */}
          <button className="w-full bg-white border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold hover:bg-slate-50 active:scale-95 transition">
            <img src="https://img.icons8.com/color/48/google-logo.png" className="w-6" />
            Google Pay
          </button>
        </div>

        {/* Separador */}
        <div className="relative my-6">
          <div className="border-t border-slate-300" />
          <span className="absolute inset-0 flex justify-center -top-3 bg-white px-3 text-sm text-slate-500">
            O pagar con tarjeta
          </span>
        </div>

        {/* Método Tarjeta */}
        <div
          className={`p-4 border rounded-xl cursor-pointer mb-4 transition ${
            method === "card"
              ? "border-orange-500 bg-orange-50"
              : "border-slate-300 hover:bg-slate-50"
          }`}
          onClick={() => setMethod("card")}
        >
          <div className="flex items-center gap-3">
            <CreditCardIcon className="w-6 h-6" />
            <span className="font-medium">Tarjeta de Crédito / Débito</span>
          </div>
        </div>

        {/* FORMULARIO TARJETA */}
        {method === "card" && (
          <form className="space-y-4 animate-fadeIn">

            {/* Número */}
            <div>
              <label className="text-sm text-slate-700 font-medium">Número de tarjeta</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="text-sm text-slate-700 font-medium">Nombre del titular</label>
              <input
                type="text"
                placeholder="Tu nombre como aparece en la tarjeta"
                className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {/* Exp + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700 font-medium">Expiración</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700 font-medium">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* TOTAL */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
          <span className="text-slate-700 font-medium">Total a pagar:</span>
          <span className="text-xl font-bold text-orange-600">
            ${total.toLocaleString()}
          </span>
        </div>

        {/* BOTÓN PAGAR */}
        <button className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition">
          Confirmar pago
        </button>

        {/* VOLVER */}
        <button
          onClick={() => navigate("/carrito")}
          className="w-full text-center mt-4 text-sm text-slate-600 hover:text-orange-600 transition"
        >
          ← Seguir comprando
        </button>
      </div>
    </div>
  );
}