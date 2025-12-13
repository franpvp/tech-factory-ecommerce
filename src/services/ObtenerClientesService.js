import { obtenerToken } from "../auth/tokenProvider";

const ObtenerClientesService = async () => {
  const endpointClientes =
    import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;

  const token = await obtenerToken();

  const res = await fetch(endpointClientes, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener clientes");
  }

  return res.json();
};

export default ObtenerClientesService;
