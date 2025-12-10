
const ObtenerClientesService = async () => {
  const endpointClientes = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;

  try {
    const res = await fetch(endpointClientes, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Error al obtener clientes. Status: ${res.status} - ${errorText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error en ObtenerClientesService:", error);
    throw error;
  }
};

export default ObtenerClientesService;