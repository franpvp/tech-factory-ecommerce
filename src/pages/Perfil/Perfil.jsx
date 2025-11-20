import React from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function Perfil() {
  // Datos simulados (puedes reemplazarlos por MSAL o tu API)
  const user = {
    nombre: "Francisca Valdivia",
    correo: "francisca.valdivia@example.com",
    telefono: "+56 9 5612 4567",
    direccion: "Av. Siempre Viva 742, Santiago",
    rol: "Cliente Premium",
    fechaRegistro: "15 Marzo 2024",
    avatar: "https://i.pravatar.cc/150?img=47",
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-4xl mx-auto px-4">

        {/* ENCABEZADO */}
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-lg">
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-300 opacity-90" />

          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <img
              src={user.avatar}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
            />
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="mt-20 bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {user.nombre}
          </h2>
          <p className="text-slate-500 text-sm">{user.correo}</p>

          {/* INFO DEL USUARIO */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* DATO */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Rol</p>
              <p className="text-sm font-semibold">{user.rol}</p>
            </div>

            {/* DATO */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Fecha de registro</p>
              <p className="text-sm font-semibold">{user.fechaRegistro}</p>
            </div>

            {/* DATO */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Teléfono</p>
              <p className="text-sm font-semibold">{user.telefono}</p>
            </div>

            {/* DATO */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500">Dirección</p>
              <p className="text-sm font-semibold">{user.direccion}</p>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="mt-8 flex gap-4">
            <button className="px-5 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 active:scale-95 transition">
              Editar perfil
            </button>

            <button className="px-5 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition">
              Cambiar contraseña
            </button>
          </div>
        </div>

        {/* TARJETA ADICIONAL: MEMBRESÍA */}
        <div className="mt-6 bg-slate-900 text-white rounded-3xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-2">Membresía premium</h3>
          <p className="text-sm text-slate-300">
            Obtén descuentos exclusivos, acceso anticipado a ofertas y soporte prioritario.
          </p>

          <button className="mt-4 px-5 py-3 bg-orange-500 rounded-xl font-semibold hover:bg-orange-400 active:scale-95 transition">
            Ver beneficios
          </button>
        </div>
      </main>
    </div>
  );
}