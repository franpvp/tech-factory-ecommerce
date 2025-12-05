import React, { useEffect, useState } from "react";
import DashboardLayout from "../Layout/DashboardLayout";

export default function DashboardHome() {
  const [reintentos, setReintentos] = useState([]);

  const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT_REINTENTOS;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(endpoint);
      const data = await res.json();
      setReintentos(data);
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Reintentos de Pago Fallidos</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <table className="w-full text-left">
          <thead className="text-slate-600 border-b">
            <tr>
              <th className="py-3">ID Pago</th>
              <th className="py-3">Cliente</th>
              <th className="py-3">Monto</th>
              <th className="py-3">Motivo</th>
              <th className="py-3">Fecha</th>
              <th className="py-3">Reintentos</th>
            </tr>
          </thead>

          <tbody>
            {reintentos.map((r) => (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{r.idPago}</td>
                <td>{r.clienteNombre}</td>
                <td className="text-orange-600 font-semibold">
                  ${r.monto.toLocaleString()}
                </td>
                <td>{r.motivo}</td>
                <td>{new Date(r.fecha).toLocaleString()}</td>
                <td className="font-bold">{r.reintentos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}