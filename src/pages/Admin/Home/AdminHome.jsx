import React, { useEffect, useState } from "react";
import { DashboardCards } from "../../Dashboard/Cards/DashboardCards";
import { OrdenesPieChart } from "../../Dashboard/Graficos/OrdenesPieChart";
import { fetchDashboardMetrics } from "../../../services/fetchDashboardMetrics";

export default function AdminHome() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchDashboardMetrics().then(setMetrics);
  }, []);

  if (!metrics)
    return <p className="text-slate-400 p-6">Cargando métricas...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-1">Panel de Administración</h1>
      <p className="text-slate-400 mb-8">Resumen de la actividad del sistema</p>

      <DashboardCards
        usuariosActivos={metrics.activos}
        ventasCorrectas={metrics.correctas}
        ordenesHoy={metrics.ordenesHoy}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
        <OrdenesPieChart data={metrics.ordenesHoy} />
      </div>
    </div>
  );
}