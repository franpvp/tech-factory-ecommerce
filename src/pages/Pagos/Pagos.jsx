import React, { useState, useMemo } from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";

export default function Pagos() {
  const navigate = useNavigate();
  const { cart, carritoId } = useCart();

  // Calculamos el total localmente
  const total = useMemo(
    () => cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    [cart]
  );

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

  // ------------------------------
  // HANDLER GENERAL
  // ------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
      return;
    }

    if (name === "cardName") {
      const cleaned = value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ ]/g, "");
      setForm((prev) => ({ ...prev, cardName: cleaned }));
      return;
    }

    if (name === "expiry") {
      setForm((prev) => ({ ...prev, expiry: formatExpiry(value) }));
      return;
    }

    if (name === "cvc") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setForm((prev) => ({ ...prev, cvc: digits }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const rawCardNumber = form.cardNumber.replace(/\s/g, "");

    if (!rawCardNumber) {
      newErrors.cardNumber = "El número de tarjeta es obligatorio.";
    } else if (!/^\d{16}$/.test(rawCardNumber)) {
      newErrors.cardNumber = "La tarjeta debe tener 16 dígitos.";
    }

    if (!form.cardName.trim()) {
      newErrors.cardName = "El nombre del titular es obligatorio.";
    } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/.test(form.cardName)) {
      newErrors.cardName = "Solo se permiten letras.";
    } else if (form.cardName.trim().length < 3) {
      newErrors.cardName = "Debe tener mínimo 3 letras.";
    }

    if (!form.expiry.trim()) {
      newErrors.expiry = "La expiración es obligatoria.";
    } else {
      const match = /^(\d{2})\/(\d{4})$/.exec(form.expiry);
      if (!match) {
        newErrors.expiry = "Formato inválido. Usa MM/AAAA.";
      } else {
        const month = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          newErrors.expiry = "El mes debe ser entre 01 y 12.";
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiry = "La tarjeta está vencida.";
        }
      }
    }

    if (!form.cvc) {
      newErrors.cvc = "El CVC es obligatorio.";
    } else if (!/^\d{3,4}$/.test(form.cvc)) {
      newErrors.cvc = "Debe tener entre 3 y 4 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPayment = async () => {
    setApiError(null);

    if (!validate()) return;

    if (!carritoId) {
      setApiError(
        "No se encontró el carrito. Intenta actualizar la página o volver al carrito."
      );
      return;
    }

    if (cart.length === 0) {
      setApiError("Tu carrito está vacío.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8081/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCarrito: carritoId,
          idMetodoPago: 1, // por ahora tarjeta = 1
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden");
      }

      const data = await response.json();

      navigate("/confirmacion", { state: { orden: data } });
    } catch (err) {
      console.error(err);
      setApiError("Ocurrió un error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 px-4 flex justify-center">
        <div className="bg-white shadow-xl border border-slate-200 p-8 rounded-2xl w-full max-w-2xl animate-fadeIn">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            Métodos de Pago
          </h1>

          {/* MÉTODOS RÁPIDOS */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold active:scale-95 transition">
               Pay
            </button>

            <button className="w-full bg-white border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold hover:bg-slate-50 active:scale-95 transition">
              <img
                src="https://img.icons8.com/color/48/google-logo.png"
                className="w-6"
              />
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

          {/* SELECCIÓN MÉTODO TARJETA */}
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
            <form
              className="space-y-4 animate-fadeIn"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Número */}
              <div>
                <label className="text-sm text-slate-700 font-medium">
                  Número de tarjeta
                </label>
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
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className="text-sm text-slate-700 font-medium">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="Juan Pérez"
                  value={form.cardName}
                  onChange={handleChange}
                  className={`w-full mt-1 p-3 border rounded-xl ${
                    errors.cardName ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.cardName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardName}
                  </p>
                )}
              </div>

              {/* Exp + CVC */}
              <div className="grid grid-cols-2 gap-4">
                {/* Exp */}
                <div>
                  <label className="text-sm text-slate-700 font-medium">
                    Expiración (MM/AAAA)
                  </label>
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
                  {errors.expiry && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.expiry}
                    </p>
                  )}
                </div>

                {/* CVC */}
                <div>
                  <label className="text-sm text-slate-700 font-medium">
                    CVC
                  </label>
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
                  {errors.cvc && (
                    <p className="mt-1 text-sm text-red-500">{errors.cvc}</p>
                  )}
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

          {apiError && (
            <p className="mt-3 text-sm text-red-500 text-center">{apiError}</p>
          )}

          {/* BOTÓN PAGAR */}
          <button
            onClick={submitPayment}
            disabled={loading || cart.length === 0}
            className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Confirmar pago"}
          </button>

          {/* VOLVER */}
          <button
            onClick={() => navigate("/carrito")}
            className="w-full text-center mt-4 text-sm text-slate-600 hover:text-orange-600 transition"
          >
            ← Seguir comprando
          </button>
        </div>
      </main>
    </div>
  );
}