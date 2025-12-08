
const ObtenerClientesService = async () => {
  const endpointClientes = import.meta.env.VITE_SERVICE_ENDPOINT_OBTENER_CLIENTES;

  try {
    const res = await fetch(endpointClientes, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // Puedes loguear más info aquí si quieres
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Error al obtener clientes. Status: ${res.status} - ${errorText}`
      );
    }

    const data = await res.json();
    return data; // será la lista de clientes
  } catch (error) {
    console.error("Error en ObtenerClientesService:", error);
    throw error; // lo relanzas para manejarlo en el componente
  }
};

export default ObtenerClientesService;