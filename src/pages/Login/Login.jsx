import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const navigate = useNavigate();

  // --- LOGIN NORMAL → HOME ---
  const handleMicrosoftLogin = () => {
    sessionStorage.setItem("postLoginRedirect", "/"); // <-- intención

    instance.loginRedirect({
      redirectUri: "/", // <-- SIEMPRE LA RAÍZ
    });
  };

  // --- LOGIN ADMIN → /admin ---
  const handleMicrosoftAdminLogin = () => {
    sessionStorage.setItem("postLoginRedirect", "/admin"); // <-- intención

    instance.loginRedirect({
      redirectUri: "/", // <-- SIEMPRE LA RAÍZ
    });
  };

  // --- REDIRECCIÓN DESPUÉS DEL LOGIN ---
  useEffect(() => {
    if (isAuthenticated) {
      const target = sessionStorage.getItem("postLoginRedirect") || "/";

      sessionStorage.removeItem("postLoginRedirect");

      navigate(target);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200 animate-fadeIn">

        {/* Logo */}
        <h1 className="text-center text-2xl font-bold mb-6 tracking-tight text-slate-800">
          <span className="text-orange-600">Tech</span> Factory
        </h1>

        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Iniciar sesión
        </h2>

        <p className="text-sm text-slate-600 mb-6">
          Accede a tu cuenta para continuar
        </p>

        {/* FORMULARIO LOCAL */}
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-700 font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="tuemail@ejemplo.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition active:scale-95">
            Ingresar
          </button>
        </form>

        {/* BOTÓN MICROSOFT LOGIN NORMAL */}
        <div className="mt-6">
          <button
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition"
          >
            <img
              src="https://img.icons8.com/color/48/000000/microsoft.png"
              className="w-6 h-6"
            />
            Iniciar sesión con Microsoft
          </button>
        </div>

        {/* BOTÓN ADMIN LOGIN */}
        <div className="mt-3">
          <button
            onClick={handleMicrosoftAdminLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 shadow-sm"
          >
            Acceso al Panel de Administración
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-orange-600 font-semibold hover:underline">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}