import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();

  const user = {
    nombre: "Francisca Valdivia",
    correo: "francisca.valdivia@example.com",
    telefono: "+56 9 5612 4567",
    direccion: "Av. Siempre Viva 742, Santiago",
    rol: "Cliente Premium",
    fechaRegistro: "15 Marzo 2024",
    avatar: "https://i.pravatar.cc/300?img=47",
  };

  const pedidos = [
    {
      id: "PED-2024011",
      fecha: "20 Feb 2025",
      total: 129990,
      estado: "Entregado",
      items: [
        { nombre: "Teclado Mecánico RGB", cantidad: 1, precio: 59990 },
        { nombre: "Mouse Gamer Inalámbrico", cantidad: 1, precio: 69990 },
      ],
    },
    {
      id: "PED-2024012",
      fecha: "15 Ene 2025",
      total: 89990,
      estado: "En camino",
      items: [{ nombre: "Audífonos HyperX", cantidad: 1, precio: 89990 }],
    },
  ];

  const [openPedido, setOpenPedido] = useState(null);

  const togglePedido = (id) => {
    setOpenPedido(openPedido === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-5xl mx-auto px-4">
        {/* TARJETA PRINCIPAL DE PERFIL */}
        <section className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* BANNER SUPERIOR */}
          <div className="h-32 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-300" />

          {/* AVATAR + NOMBRE + ROL */}
          <div className="flex flex-col items-center -mt-16 pb-6 px-6">
            <img
              src={user.avatar}
              alt="Foto de perfil"
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
            />

            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-900 text-center">
              {user.nombre}
            </h2>
            <p className="text-slate-500 text-sm text-center">{user.correo}</p>

            <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full border border-orange-200">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
              {user.rol}
            </span>
          </div>

          {/* INFO DEL USUARIO */}
          <div className="border-t border-slate-200 px-8 pb-8 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* TELÉFONO */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Teléfono</p>
                <p className="text-sm font-semibold mt-1">{user.telefono}</p>
              </div>

              {/* DIRECCIÓN */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Dirección</p>
                <p className="text-sm font-semibold mt-1">{user.direccion}</p>
              </div>

              {/* FECHA REGISTRO */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Fecha de registro</p>
                <p className="text-sm font-semibold mt-1">
                  {user.fechaRegistro}
                </p>
              </div>
            </div>

            {/* BOTONES ACCIÓN */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 active:scale-95 transition">
                Editar perfil
              </button>

              <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition">
                Cambiar contraseña
              </button>
            </div>
          </div>
        </section>

        {/* COLLAPSE DE PEDIDOS */}
        <section className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Mis pedidos
          </h3>

          {pedidos.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aún no has realizado pedidos. Cuando compres, aparecerán aquí ✨
            </p>
          ) : (
            <div className="space-y-4">
              {pedidos.map((p) => (
                <div
                  key={p.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50"
                >
                  {/* HEADER COLLAPSE */}
                  <button
                    onClick={() => togglePedido(p.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-sm md:text-base">
                        {p.id}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.fecha} —{" "}
                        <span
                          className={
                            p.estado === "Entregado"
                              ? "text-emerald-600 font-semibold"
                              : "text-amber-600 font-semibold"
                          }
                        >
                          {p.estado}
                        </span>
                      </p>
                    </div>

                    {openPedido === p.id ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>

                  {/* CONTENIDO COLLAPSE */}
                  {openPedido === p.id && (
                    <div className="p-4 bg-white border-t border-slate-200">
                      <ul className="space-y-3">
                        {p.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between text-sm text-slate-700"
                          >
                            <span>
                              {item.nombre}{" "}
                              <span className="text-xs text-slate-500">
                                × {item.cantidad}
                              </span>
                            </span>
                            <span className="font-semibold text-orange-600">
                              ${item.precio.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                        <span>Total del pedido:</span>
                        <span className="text-orange-600">
                          ${p.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MEMBRESÍA */}
        <section className="mt-10 bg-slate-900 text-white rounded-3xl shadow-xl p-8">
          <h3 className="text-xl font-semibold mb-2">Membresía Premium</h3>
          <p className="text-sm text-slate-300">
            Descuentos exclusivos, soporte prioritario y acceso anticipado a
            ofertas.
          </p>

          <button
            onClick={() => navigate("/beneficios")}
            className="mt-4 px-5 py-3 bg-orange-500 rounded-xl font-semibold hover:bg-orange-400 active:scale-95 transition"
          >
            Ver beneficios
          </button>
        </section>
      </main>
    </div>
  );
}