import { obtenerToken } from "../auth/tokenProvider";

const BASE = import.meta.env.VITE_BFF_METRICS;

export async function fetchDashboardMetrics() {

  const endpoints = {
    ordenesHoy: `${BASE}/ordenes/hoy`,
    correctas: `${BASE}/ordenes/hoy/correctas`,
    activos: `${BASE}/usuarios/activos`,
  };

  const token = await obtenerToken();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [ordenesHoyRes, correctasRes, activosRes] = await Promise.all([
    fetch(endpoints.ordenesHoy, { headers }),
    fetch(endpoints.correctas, { headers }),
    fetch(endpoints.activos, { headers }),
  ]);

  if (!ordenesHoyRes.ok || !correctasRes.ok || !activosRes.ok) {
    throw new Error("Error al obtener métricas del dashboard");
  }

  return {
    ordenesHoy: await ordenesHoyRes.json(),
    correctas:  await correctasRes.json(),
    activos:    await activosRes.json(),
  };
}
