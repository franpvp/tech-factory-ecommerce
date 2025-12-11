// src/services/fetchDashboardMetrics.js

import { msalInstance } from "../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

// Base URL desde ENV
const BASE = import.meta.env.VITE_BFF_METRICS;

export async function fetchDashboardMetrics() {

  const endpoints = {
    ordenesHoy: `${BASE}/ordenes/hoy`,
    correctas: `${BASE}/ordenes/hoy/correctas`,
    activos: `${BASE}/usuarios/activos`,
  };

  try {
    const accounts = msalInstance.getAllAccounts();

    const tokenResponse = await msalInstance.acquireTokenSilent({
      scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
      account: accounts[0],
    });

    const token = tokenResponse.accessToken;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Llamadas en paralelo a los 3 endpoints protegidos
    const [ordenesHoyRes, correctasRes, activosRes] = await Promise.all([
      fetch(endpoints.ordenesHoy, { headers }),
      fetch(endpoints.correctas, { headers }),
      fetch(endpoints.activos, { headers }),
    ]);

    // Procesar JSON
    const ordenesHoy = await ordenesHoyRes.json();
    const correctas = await correctasRes.json();
    const activos   = await activosRes.json();

    return {
      ordenesHoy,
      correctas,
      activos,
    };

  } catch (error) {
    // Reintento en caso de requerir popup
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenPopup({
        scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
      });

      return fetchDashboardMetrics(); // vuelve a intentarlo
    }

    console.error("Error obteniendo métricas:", error);
    throw error;
  }
}