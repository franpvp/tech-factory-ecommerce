import React from "react";
import { useMsal } from "@azure/msal-react";

export default function Register() {
  const { instance } = useMsal();

  const handleMicrosoftRegister = () => {
    instance.loginPopup({
      scopes: ["user.read"]
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200 animate-fadeIn">

        <h1 className="text-center text-2xl font-bold mb-6 tracking-tight text-slate-800">
          <span className="text-orange-600">Tech</span> Factory
        </h1>

        <h2 className="text-xl font-semibold text-slate-900 mb-2">Crear cuenta</h2>
        <p className="text-sm text-slate-600 mb-6">
          Completa los datos para registrarte
        </p>

        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-700 font-medium">Nombre completo</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium">Correo electrónico</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium">Contraseña</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition active:scale-95">
            Registrarme
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleMicrosoftRegister}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition"
          >
            <img src="https://img.icons8.com/color/48/000000/microsoft.png" className="w-6 h-6" />
            Registrarme con Microsoft
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-orange-600 font-semibold hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}