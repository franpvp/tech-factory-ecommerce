import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { msalInstance } from "../../auth/authConfig";
import { ENV } from "../../config/env";

import { UserIcon } from "@heroicons/react/24/solid";

const ORDERS_PER_PAGE = 4;

export default function Perfil() {
  const { accounts } = useMsal();

  const userEmail = accounts[0]?.username;

  const endpointClientes = ENV.SERVICE_CLIENTES;
  const endpointOrdenes = ENV.SERVICE_ORDENES;

  const [cliente, setCliente] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPedido, setOpenPedido] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const obtenerToken = async () => {
    const isTestMode = ENV.TEST_MODE;
    if (isTestMode) return "TEST_TOKEN";

    try {
      const accs = msalInstance.getAllAccounts();
      if (accs.length === 0) return null;

      const response = await msalInstance.acquireTokenSilent({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
        account: accs[0],
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
        setLoading(false);
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
        setPedidos(Array.isArray(data) ? data : []);
        setCurrentPage(1);
        setOpenPedido(null);
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

  // ===== Paginación =====
  const totalPages = Math.max(1, Math.ceil(pedidos.length / ORDERS_PER_PAGE));

  const pedidosPaginados = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    const end = currentPage * ORDERS_PER_PAGE;
    return pedidos.slice(start, end);
  }, [pedidos, currentPage]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const formatCLP = (n) => (Number(n || 0)).toLocaleString();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <main className="pt-[90px] pb-16 max-w-5xl mx-auto px-4 animate-pulse">

          {/* CARD PERFIL */}
          <section className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

            {/* BANNER */}
            <div className="h-32 bg-slate-200" />

            {/* AVATAR */}
            <div className="flex flex-col items-center -mt-16 pb-6 px-6">
              <div className="w-28 h-28 rounded-3xl bg-slate-300 border-4 border-white shadow-xl" />

              <div className="mt-4 h-6 w-48 bg-slate-300 rounded-lg" />
              <div className="mt-2 h-4 w-64 bg-slate-200 rounded-lg" />
            </div>

            {/* INFO PERSONAL */}
            <div className="border-t border-slate-200 px-8 pb-8 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="h-3 w-20 bg-slate-300 rounded mb-2" />
                  <div className="h-5 w-32 bg-slate-300 rounded" />
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="h-3 w-20 bg-slate-300 rounded mb-2" />
                  <div className="h-5 w-40 bg-slate-300 rounded" />
                </div>

              </div>
            </div>
          </section>

          {/* HISTORIAL DE PEDIDOS */}
          <section className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
            <div className="h-6 w-40 bg-slate-300 rounded mb-6" />

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-4 w-32 bg-slate-300 rounded mb-2" />
                      <div className="h-3 w-48 bg-slate-200 rounded" />
                    </div>
                    <div className="h-5 w-5 bg-slate-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
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
            <div className="w-28 h-28 rounded-3xl bg-orange-600 border-4 border-white shadow-xl flex items-center justify-center">
              <UserIcon className="w-14 h-14 text-white" />
            </div>
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
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-xl font-bold">Mis pedidos</h3>

            {/* PAGINACIÓN TOP */}
            {pedidos.length > 0 && totalPages > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Anterior
                </button>
                <span className="text-sm text-slate-600">
                  Página <span className="font-semibold text-slate-900">{currentPage}</span> de{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </span>
                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            {pedidos.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aún no has realizado pedidos.
              </p>
            ) : (
              <div className="space-y-4">
                {pedidosPaginados.map((p) => (
                  <div
                    key={p.idOrden}
                    className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden"
                  >
                    {/* HEADER */}
                    <button
                      onClick={() => togglePedido(p.idOrden)}
                      className="w-full flex justify-between items-center p-4 hover:bg-slate-100 transition"
                    >
                      <div className="text-left">
                        <p className="font-semibold text-sm">
                          Orden #{p.idOrden}
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.fechaCreacion || ""}{" "}
                          {p.fechaCreacion ? "—" : ""}
                          <span
                            className={`font-semibold ${
                              (p.estadoOrden || "").toUpperCase().includes("CORRECTO") ||
                              (p.estadoOrden || "").toUpperCase().includes("OK")
                                ? "text-emerald-700"
                                : "text-orange-700"
                            }`}
                          >
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
                          {(p.listaDetalle || []).map((item) => {
                            const nombre = item?.producto?.nombre || "Producto";
                            const img = item?.producto?.imagenUrl;
                            const subtotal = item?.subtotal ?? 0;

                            return (
                              <li
                                key={item.idDetalleOrden}
                                className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200 bg-slate-50"
                              >
                                {/* IMG */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0">
                                  {img ? (
                                    <img
                                      src={img}
                                      alt={nombre}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                      Sin imagen
                                    </div>
                                  )}
                                </div>

                                {/* INFO */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-900 truncate">
                                    {nombre}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Cantidad: <span className="font-semibold">{item?.cantidad ?? 0}</span>
                                  </p>
                                </div>

                                {/* SUBTOTAL */}
                                <div className="text-right">
                                  <p className="text-xs text-slate-500">Subtotal</p>
                                  <p className="text-orange-600 font-bold">
                                    ${formatCLP(subtotal)}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>

                        {/* TOTAL */}
                        <div className="flex justify-between items-center font-bold text-lg border-t pt-4 mt-4">
                          <span>Total del pedido:</span>
                          <span className="text-orange-600">
                            ${formatCLP(p.totalPrecio ?? p.total ?? 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PAGINACIÓN BOTTOM */}
          {pedidos.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={goPrev}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Anterior
              </button>

              <span className="text-sm text-slate-600">
                Página <span className="font-semibold text-slate-900">{currentPage}</span> de{" "}
                <span className="font-semibold text-slate-900">{totalPages}</span>
              </span>

              <button
                onClick={goNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Siguiente
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}