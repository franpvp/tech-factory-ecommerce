import React, { useState, useMemo, useEffect } from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

import PaymentLoading from "../../components/Loading/PaymentLoading";

const COSTO_ENVIO = 4990;

async function obtenerToken(instance, accounts) {
  try {
    if (!accounts?.length) return null;

    try {
      const silent = await instance.acquireTokenSilent({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        account: accounts[0],
      });

      return silent.accessToken;

    } catch (silentError) {
      if (silentError instanceof InteractionRequiredAuthError) {

        const popup = await instance.acquireTokenPopup({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        });

        return popup.accessToken;
      }

      throw silentError;
    }

  } catch (err) {
    console.error("Error obteniendo token:", err);
    return null;
  }
}

export default function Pagos() {

  const endpointObtenerClientes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();

  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [pollInterval, setPollInterval] = useState(null);

  const userEmail = accounts[0]?.username;

  const despacho = JSON.parse(localStorage.getItem("despacho"));
  const { cart, listaDetalle } = useCart();

  const [idCliente, setIdCliente] = useState(null);

  // === Obtener cliente por email ===
  useEffect(() => {
    if (!userEmail) return;

    const fetchCliente = async () => {
      try {
        const URL = `${endpointObtenerClientes}/email/${encodeURIComponent(userEmail)}`;
        const res = await fetch(URL);

        if (!res.ok) throw new Error("No se pudo obtener el usuario");

        const data = await res.json();
        setIdCliente(data.id);

      } catch (e) {
        console.error("🔥 Error obteniendo cliente:", e);
      }
    };

    fetchCliente();
  }, [userEmail]);

  // === Cleanup de polling & timeout al desmontar ===
  useEffect(() => {
    return () => {
      console.log("🛑 Cleanup ejecutado: deteniendo polling y timeout...");

      if (pollInterval) {
        clearInterval(pollInterval);
        console.log("✔ Polling detenido");
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
        console.log("✔ Timeout detenido");
      }
    };
  }, [pollInterval, timeoutId]);

  const totalProductos = useMemo(
    () => cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    [cart]
  );
  const total = totalProductos + COSTO_ENVIO;

  const [method, setMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setForm({ ...form, cardNumber: formatCardNumber(value) });
      return;
    }
    if (name === "cardName") {
      const cleaned = value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ ]/g, "");
      setForm({ ...form, cardName: cleaned });
      return;
    }
    if (name === "expiry") {
      setForm({ ...form, expiry: formatExpiry(value) });
      return;
    }
    if (name === "cvc") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setForm({ ...form, cvc: digits });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const rawCardNumber = form.cardNumber.replace(/\s/g, "");

    if (!rawCardNumber) newErrors.cardNumber = "El número de tarjeta es obligatorio.";
    else if (!/^\d{16}$/.test(rawCardNumber))
      newErrors.cardNumber = "La tarjeta debe tener 16 dígitos.";

    if (!form.cardName.trim())
      newErrors.cardName = "El nombre del titular es obligatorio.";

    if (!form.expiry.trim())
      newErrors.expiry = "La expiración es obligatoria.";

    if (!form.cvc)
      newErrors.cvc = "El CVC es obligatorio.";
    else if (!/^\d{3,4}$/.test(form.cvc))
      newErrors.cvc = "Debe tener entre 3 y 4 dígitos.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const pollEstadoOrden = async (idOrdenLocal) => {

    const endpointOrdenes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_ORDENES;
    const url = `${endpointOrdenes}/cliente/${idCliente}/ultima`;

    // Obtener token ANTES de comenzar el intervalo
    const token = await obtenerToken(instance, accounts);

    if (!token) {
      console.error("❌ No se pudo obtener token para polling.");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        console.log("📡 Estado orden:", data);

        const estado = data.estadoOrden
          ?.toUpperCase()
          .replace(/[\s_-]+/g, "_")
          .trim();

        // Si CAMBIÓ de estado
        if (estado !== "PAGO_PENDIENTE") {

          clearInterval(interval);
          clearTimeout(timeoutId);
          setWaitingForPayment(false);

          if (estado === "PAGO_CORRECTO") {
            navigate("/confirmacion-compra", { state: { orden: data } });
          } else {
            navigate("/pago-fallido", { 
              state: { reason: "El pago fue rechazado." } 
            });
          }
        }

      } catch (error) {
        console.error("❌ Error en polling:", error);
      }
    }, 2000);

    setPollInterval(interval);
  };


  // SUBMIT DEL PAGO
  const submitPayment = async () => {
    setApiError(null);

    if (!validate()) return;
    if (!idCliente) return setApiError("No fue posible obtener el cliente.");
    if (!despacho) return setApiError("No se encontró la información de despacho.");
    if (cart.length === 0) return setApiError("Tu carrito está vacío.");

    const payload = {
      idCliente,
      despachoDto: despacho,
      pagoDto: { idMetodoPago: 1, monto: total },
      listaDetalle,
    };

    try {
      setLoading(true);

      const token = await obtenerToken(instance, accounts);
      if (!token) throw new Error("No se pudo obtener token de autenticación");

      const url = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_ORDENES;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al crear la orden");

      const data = await response.json();

      localStorage.removeItem("despacho");
      setWaitingForPayment(true);

      const timeout = setTimeout(() => {
        console.warn("⏳ Timeout: no hubo respuesta en 10s.");

        if (pollInterval) clearInterval(pollInterval);

        navigate("/pago-fallido", {
          state: { reason: "Tiempo de espera agotado. No se obtuvo respuesta del pago." }
        });
      }, 10000);

      setTimeoutId(timeout);

      // Inicia polling
      pollEstadoOrden(data.idOrden);

    } catch (err) {
      console.error("Error submitPayment:", err);
      setApiError("Ocurrió un error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (waitingForPayment) {
    return <PaymentLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 px-4 flex justify-center">
        <div className="bg-white shadow-xl border border-slate-200 p-8 rounded-2xl w-full max-w-2xl animate-fadeIn">

          <h1 className="text-2xl font-bold text-slate-900 mb-6">Métodos de Pago</h1>

          {/* APPLE / GOOGLE PAY */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold">
               Pay
            </button>

            <button className="w-full bg-white border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold">
              <img src="https://img.icons8.com/color/48/google-logo.png" className="w-6" />
              Google Pay
            </button>
          </div>

          {/* MÉTODO TARJETA */}
          <div
            className={`p-4 border rounded-xl cursor-pointer mb-4 ${
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

          {/* FORM */}
          {method === "card" && (
            <form className="space-y-4 animate-fadeIn" onSubmit={(e) => e.preventDefault()}>
              
              {/* Número */}
              <div>
                <label className="text-sm font-medium text-slate-700">Número de tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={form.cardNumber}
                  onChange={handleChange}
                  className={`w-full mt-1 p-3 border rounded-xl ${
                    errors.cardNumber ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>

              {/* Nombre */}
              <div>
                <label className="text-sm font-medium text-slate-700">Nombre del titular</label>
                <input
                  type="text"
                  name="cardName"
                  value={form.cardName}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className={`w-full mt-1 p-3 border rounded-xl ${
                    errors.cardName ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Exp */}
                <div>
                  <label className="text-sm font-medium text-slate-700">Expiración</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/AAAA"
                    value={form.expiry}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.expiry ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
                </div>

                {/* CVC */}
                <div>
                  <label className="text-sm font-medium text-slate-700">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="123"
                    value={form.cvc}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.cvc ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
                </div>
              </div>
            </form>
          )}

          {/* TOTAL */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between">
            <span className="text-slate-700 font-medium">Total a pagar:</span>
            <span className="text-xl font-bold text-orange-600">${total.toLocaleString()}</span>
          </div>

          {apiError && <p className="text-red-500 text-center text-sm mt-3">{apiError}</p>}

          {/* BOTÓN */}
          <button
            onClick={submitPayment}
            disabled={loading || cart.length === 0}
            className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Procesando..." : "Confirmar pago"}
          </button>

          <button
            onClick={() => navigate("/carrito")}
            className="w-full text-center mt-4 text-sm text-slate-600 hover:text-orange-600"
          >
            ← Seguir comprando
          </button>

        </div>
      </main>
    </div>
  );
}