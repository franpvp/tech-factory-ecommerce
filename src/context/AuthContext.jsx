import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useMsal } from "@azure/msal-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { accounts } = useMsal();

  const [rol, setRol] = useState(null);        // ADMIN | VENDEDOR | CLIENTE
  const [loadingRol, setLoadingRol] = useState(true);

  const fetchRol = useCallback(async () => {
    if (!accounts || accounts.length === 0) {
      setRol(null);
      setLoadingRol(false);
      return;
    }

    setLoadingRol(true);

    try {
      const email = accounts[0].username;

      const url = `${import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES}/email/${encodeURIComponent(email)}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("No se pudo obtener cliente");
      }

      const data = await res.json();
      const usuario = data?.usuario;
      const tipoUsuario = usuario?.tipoUsuarioDTO;
      const rolBackend = tipoUsuario?.nombreTipo;
      setRol(rolBackend ?? "CLIENTE");

    } catch (error) {
      setRol(null);
    } finally {
      setLoadingRol(false);
    }
  }, [accounts]);

  useEffect(() => {
    fetchRol();
  }, [fetchRol]);

  return (
    <AuthContext.Provider
      value={{
        rol,
        loadingRol,
        refetchRol: fetchRol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);