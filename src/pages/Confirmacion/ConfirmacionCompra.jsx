import React, { useEffect, useState, useMemo } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";
import { msalInstance } from "../../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

export default function ConfirmacionCompra() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { accounts } = useMsal();

  const endpointClientes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;
  const endpointOrdenes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_ORDENES;

  const userEmail = accounts[0]?.username;

  // ==== TODOS LOS HOOKS VAN AQUÍ, SIN CONDICIONES ====
  const [idCliente, setIdCliente] = useState(null);
  const [ordenEstado, setOrdenEstado] = useState(null);
  const [ordenCompleta, setOrdenCompleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const COSTO_ENVIO = 4990;

  // ListaDetalle SIEMPRE se calcula aunque esté vacío
  const listaDetalle = ordenCompleta?.listaDetalle || [];

  const { total, totalConEnvio, cantidad } = useMemo(() => {
    const totalCalc = listaDetalle.reduce((acc, d) => acc + d.subtotal, 0);
    const cant = listaDetalle.reduce((acc, d) => acc + d.cantidad, 0);

    return { 
      total: totalCalc, 
      totalConEnvio: totalCalc + COSTO_ENVIO, 
      cantidad: cant 
    };
  }, [listaDetalle]);

  // =======================================
  // TOKEN
  // =======================================
  const obtenerToken = async () => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) return null;

      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          account: accounts[0],
        });
        return response.accessToken;

      } catch (silentErr) {
        if (silentErr instanceof InteractionRequiredAuthError) {
          const popupResponse = await msalInstance.acquireTokenPopup({
            scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          });
          return popupResponse.accessToken;
        }
        throw silentErr;
      }
    } catch (err) {
      console.error("Error token:", err);
      return null;
    }
  };

  // =======================================
  // 1) Obtener idCliente por email
  // =======================================
  useEffect(() => {
    if (!userEmail) return;

    const fetchCliente = async () => {
      try {
        const token = await obtenerToken();

        const res = await fetch(`${endpointClientes}/email/${encodeURIComponent(userEmail)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener cliente");

        const data = await res.json();
        setIdCliente(data.id);
      } catch (e) {
        console.error("Error obteniendo cliente:", e);
      }
    };

    fetchCliente();
  }, [userEmail]);

  // =======================================
  // 2) Consultar /ultima
  // =======================================
  useEffect(() => {
    if (!idCliente) return;

    const fetchUltima = async () => {
      try {
        const token = await obtenerToken();

        const url = `${endpointOrdenes}/cliente/${idCliente}/ultima`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener última orden");

        const data = await res.json();
        setOrdenEstado(data);
      } catch (err) {
        console.error("Error obteniendo última orden:", err);
      }
    };

    fetchUltima();
  }, [idCliente]);

  // =======================================
  // 3) Obtener orden completa
  // =======================================
  useEffect(() => {
    if (!ordenEstado?.idOrden) return;

    const fetchOrdenCompleta = async () => {
      try {
        const token = await obtenerToken();

        const res = await fetch(`${endpointOrdenes}/${ordenEstado.idOrden}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener orden completa");

        const data = await res.json();
        setOrdenCompleta(data);

        clearCart();
      } catch (err) {
        console.error("Error obteniendo orden completa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenCompleta();
  }, [ordenEstado]);

  // =======================================
  // LOADING
  // =======================================
  if (loading || !ordenCompleta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">Cargando información de tu compra...</p>
      </div>
    );
  }

  const orden = ordenCompleta;

  // =======================================
  // RENDER FINAL
  // =======================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 px-4 flex justify-center">
        <div className="bg-white shadow-xl border border-slate-200 p-8 rounded-2xl w-full max-w-3xl animate-fadeIn">

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              ¡Compra realizada con éxito!
            </h1>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-700 border border-slate-200">
              <span className="font-semibold">Orden Nº:</span>
              <span className="font-mono text-orange-600">{orden.idOrden}</span>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* RESUMEN DE LA COMPRA - NUEVO DISEÑO */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Resumen de la compra
              </h2>

              {/* Cantidad */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Productos</span>
                <span className="font-semibold text-slate-800">{cantidad}</span>
              </div>

              {/* Envío */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Envío</span>
                <span className="font-semibold text-green-600">Gratis</span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t border-slate-200 mt-4 pt-3">
                <span className="font-semibold text-slate-900">Total pagado</span>
                <span className="text-xl font-bold text-orange-600">
                  ${totalConEnvio.toLocaleString()}
                </span>
              </div>
            </div>
            {/* ESTADO DEL PEDIDO - NUEVO DISEÑO */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Estado del pedido
              </h2>

              {/* Traducción y estilo del estado */}
              {(() => {
                const estado = ordenEstado?.estadoOrden?.toUpperCase() || "";

                // Mapa de estados más amigables
                const estadosMap = {
                  "PAGO_PENDIENTE": {
                    label: "Procesando pago",
                    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
                    dot: "bg-yellow-500"
                  },
                  "PAGO_CORRECTO": {
                    label: "Pago aprobado",
                    color: "bg-green-100 text-green-700 border-green-300",
                    dot: "bg-green-500"
                  },
                  "PAGO_ERROR": {
                    label: "Pago rechazado",
                    color: "bg-red-100 text-red-700 border-red-300",
                    dot: "bg-red-500"
                  },
                  "PREPARANDO_PEDIDO": {
                    label: "Preparando tu pedido",
                    color: "bg-sky-100 text-sky-700 border-sky-300",
                    dot: "bg-sky-500"
                  },
                  "EN_CAMINO": {
                    label: "Tu pedido está en camino",
                    color: "bg-indigo-100 text-indigo-700 border-indigo-300",
                    dot: "bg-indigo-500"
                  },
                  "ENTREGADO": {
                    label: "Pedido entregado",
                    color: "bg-green-100 text-green-700 border-green-300",
                    dot: "bg-green-500"
                  }
                };

                const info = estadosMap[estado] || {
                  label: "Estado desconocido",
                  color: "bg-slate-100 text-slate-700 border-slate-300",
                  dot: "bg-slate-500"
                };

                return (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 mt-1 rounded-full text-sm border ${info.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${info.dot}`} />
                    <span className="font-semibold">{info.label}</span>
                  </div>
                );
              })()}

              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                Seguiremos notificando el avance de tu pedido. También puedes revisarlo en la sección “Mis pedidos”.
              </p>
            </div>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div className="mb-8">
            <div className="space-y-3">
              {/* LISTA DE PRODUCTOS - NUEVO DISEÑO */}
              {listaDetalle.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-semibold text-slate-700 mb-3">
                    Productos de tu pedido
                  </h2>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm divide-y divide-slate-200">
                    {listaDetalle.map((item) => (
                      <div
                        key={item.idDetalleOrden}
                        className="flex items-center gap-4 py-4"
                      >
                        <img
                          src={item.producto.imagenUrl}
                          alt={item.producto.nombre}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.producto.nombre}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Cantidad: <span className="font-medium text-slate-700">{item.cantidad}</span>
                          </p>
                        </div>

                        <p className="text-sm font-bold text-slate-900">
                          ${item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-500 transition"
            >
              Seguir comprando
            </button>

            <button
              onClick={() => navigate("/perfil")}
              className="border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Ver mis pedidos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}