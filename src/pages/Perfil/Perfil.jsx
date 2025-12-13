import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { msalInstance } from "../../auth/authConfig";

export default function Perfil() {
  const navigate = useNavigate();
  const { accounts } = useMsal();

  const userEmail = accounts[0]?.username;
  
  const endpointClientes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;
  const endpointOrdenes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_ORDENES;

  const [cliente, setCliente] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPedido, setOpenPedido] = useState(null);

  const obtenerToken = async () => {


     const isTestMode = import.meta.env.VITE_TEST_MODE === "true";
        if (isTestMode) {
            return "TEST_TOKEN";
          }
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) return null;

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

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const token = await obtenerToken();
        const url = `${endpointClientes}/email/${encodeURIComponent(userEmail)}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener cliente");

        const data = await res.json();
        setCliente(data);
        fetchPedidos(data.id);

      } catch (err) {
        console.error("Error obteniendo cliente:", err);
      }
    };

    const fetchPedidos = async (idCliente) => {
      try {
        const token = await obtenerToken();

        const url = `${endpointOrdenes}/cliente/${idCliente}/historial`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudieron obtener pedidos");

        const data = await res.json();
        setPedidos(data);

      } catch (err) {
        console.error("Error obteniendo pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchCliente();

  }, [userEmail]);


  const togglePedido = (id) => {
    setOpenPedido(openPedido === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-600">No se pudo cargar la información del perfil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-5xl mx-auto px-4">

        {/* TARJETA PRINCIPAL DE PERFIL */}
        <section className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

          {/* BANNER SUPERIOR */}
          <div className="h-32 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-300" />

          {/* AVATAR + NOMBRE */}
          <div className="flex flex-col items-center -mt-16 pb-6 px-6">
            <img
              src="https://i.pravatar.cc/300"
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
            />
            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              {cliente.nombre}
            </h2>

            <p className="text-slate-500 text-sm">{cliente.email}</p>
          </div>

          {/* INFO PERSONAL */}
          <div className="border-t border-slate-200 px-8 pb-8 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-500">Teléfono</p>
                <p className="text-sm font-semibold mt-1">
                  {cliente.telefono || "No registrado"}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-500">Dirección</p>
                <p className="text-sm font-semibold mt-1">
                  {cliente.direccion || "No registrada"}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* HISTORIAL DE PEDIDOS */}
        <section className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Mis pedidos</h3>

          {pedidos.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aún no has realizado pedidos.
            </p>
          ) : (
            <div className="space-y-4">
              {pedidos.map((p) => (
                <div key={p.idOrden} className="border border-slate-200 rounded-2xl bg-slate-50">

                  {/* HEADER */}
                  <button
                    onClick={() => togglePedido(p.idOrden)}
                    className="w-full flex justify-between items-center p-4 hover:bg-slate-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        Orden #{p.idOrden}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.fechaCreacion} —
                        <span className="text-orange-700 font-semibold">
                          {p.estadoOrden}
                        </span>
                      </p>
                    </div>

                    {openPedido === p.idOrden ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>

                  {/* DETALLES */}
                  {openPedido === p.idOrden && (
                    <div className="p-4 bg-white border-t border-slate-200">
                      <ul className="space-y-3">
                        {p.listaDetalle.map((item) => (
                          <li key={item.idDetalleOrden} className="flex justify-between text-sm">
                            <span>
                              {item.producto.nombre}{" "}
                              <span className="text-xs text-slate-500">× {item.cantidad}</span>
                            </span>
                            <span className="text-orange-600 font-semibold">
                              ${item.subtotal.toLocaleString()}
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
      </main>
    </div>
  );
}