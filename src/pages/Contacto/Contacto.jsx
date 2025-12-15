import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { msalInstance } from "../../auth/authConfig";

export default function Contacto() {
  const endpointContacto = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_CONTACTO;

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [sending, setSending] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const obtenerToken = async () => {
    const isTestMode = import.meta.env.VITE_TEST_MODE === "true";
    if (isTestMode) return "TEST_TOKEN";

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        account: accounts[0],
      });
      return response.accessToken;
    } catch {
      const popup = await msalInstance.acquireTokenPopup({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
      });
      return popup.accessToken;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");

    // validación mínima
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setErrMsg("Completa nombre, correo y mensaje.");
      return;
    }

    setSending(true);
    try {
      const token = await obtenerToken();

      const res = await fetch(endpointContacto, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          mensaje: mensaje.trim(),
        }),
      });

      if (!res.ok) throw new Error("No se pudo enviar el mensaje");

      setOkMsg("Mensaje enviado correctamente. Te responderemos pronto.");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      setErrMsg(err.message || "Error enviando el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
          ✉️ Contacta a <span className="text-orange-600">Tech</span> Factory
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white shadow-xl rounded-3xl border border-slate-200 p-8">
            <h2 className="text-xl font-semibold mb-6">Envíanos un mensaje</h2>

            {okMsg && (
              <div className="mb-5 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm">
                {okMsg}
              </div>
            )}

            {errMsg && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {errMsg}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nombre completo
                </label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  type="text"
                  placeholder="Tu nombre"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Mensaje
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows="5"
                  placeholder="Escribe tu mensaje aquí..."
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`mt-4 w-full py-3 rounded-xl font-semibold shadow-md active:scale-[0.98] transition
                  ${sending ? "bg-slate-300 text-slate-600 cursor-not-allowed" : "bg-orange-600 text-white hover:bg-orange-500"}
                `}
              >
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                📍 Dirección
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Av. Tecnología 123 <br /> Santiago, Chile
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                📞 Teléfono
              </h3>
              <p className="text-sm text-slate-600">+56 9 1234 5678</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                📧 Email
              </h3>
              <p className="text-sm text-slate-600">soporte@techfactory.cl</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg text-slate-900 mb-3">
                🌐 Redes Sociales
              </h3>

              <ul className="flex flex-col gap-2 text-sm text-slate-700">
                <li className="hover:text-orange-600 cursor-pointer transition">Instagram</li>
                <li className="hover:text-orange-600 cursor-pointer transition">Facebook</li>
                <li className="hover:text-orange-600 cursor-pointer transition">Twitter / X</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}