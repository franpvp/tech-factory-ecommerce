import React from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-6xl mx-auto px-4">
        {/* TÍTULO */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
          ✉️ Contacta a <span className="text-orange-600">Tech</span> Factory
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* FORMULARIO */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-3xl border border-slate-200 p-8">
            <h2 className="text-xl font-semibold mb-6">
              Envíanos un mensaje
            </h2>

            <form className="flex flex-col gap-5">
              {/* Nombre */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Mensaje
                </label>
                <textarea
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                ></textarea>
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="mt-4 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-500 active:scale-[0.98] transition"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* INFO DE CONTACTO */}
          <div className="flex flex-col gap-6">

            {/* TARJETA 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                📍 Dirección
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Av. Tecnología 123  
                <br /> Santiago, Chile
              </p>
            </div>

            {/* TARJETA 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                📞 Teléfono
              </h3>
              <p className="text-sm text-slate-600">
                +56 9 1234 5678
              </p>
            </div>

            {/* TARJETA 3 */}
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                📧 Email
              </h3>
              <p className="text-sm text-slate-600">
                soporte@techfactory.cl
              </p>
            </div>

            {/* TARJETA 4 */}
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-3">
                🌐 Redes Sociales
              </h3>

              <ul className="flex flex-col gap-2 text-sm text-slate-700">
                <li className="hover:text-orange-600 cursor-pointer transition">
                  Instagram
                </li>
                <li className="hover:text-orange-600 cursor-pointer transition">
                  Facebook
                </li>
                <li className="hover:text-orange-600 cursor-pointer transition">
                  Twitter / X
                </li>
              </ul>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}