// src/services/RegistrarClienteService.js

import { obtenerToken } from "../auth/tokenProvider";

export const RegistrarClienteService = async () => {
  const endpoint =
    import.meta.env.VITE_SERVICE_ENDPOINT_BFF_REGISTRO_CLIENTES;

  try {
    const token = await obtenerToken();

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Error al registrar cliente. Status: ${res.status} - ${errorText}`
      );
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
};
