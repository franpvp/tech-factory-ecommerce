import React, { useState } from "react";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function WhatsappButton() {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const numero = "56912345678"; // Cambia este número

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition z-[9999]"
        aria-label="Contactar por WhatsApp"
        onClick={() => setOpen(true)}
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* OVERLAY (hace click afuera) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/10 z-[9998]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* CHAT POPUP */}
      <div
        className={`fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden transition-all duration-200 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Chat de Soporte</h3>
            <p className="text-xs text-slate-300 -mt-0.5">Estamos en línea</p>
          </div>

          <button onClick={() => setOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-slate-300 hover:text-red-300" />
          </button>
        </div>

        {/* MENSAJES */}
        <div className="p-4 bg-slate-50 h-40 overflow-y-auto text-sm flex flex-col gap-3">
          <div className="self-start bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm max-w-[80%]">
            👋 Hola, ¿en qué podemos ayudarte hoy?
          </div>
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white border-t flex items-center gap-2">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            onClick={enviarMensaje}
            className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-xl active:scale-95 transition"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </>
  );
}