import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMsal } from "@azure/msal-react";

export default function ProtectedAdminRoute({ children }) {
  const { accounts } = useMsal();
  const { rol, loadingRol } = useAuth();

  // No logueado → login
  if (accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  // Esperando rol
  if (loadingRol) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Verificando permisos...
      </div>
    );
  }

  // No es ADMIN → Home
  if (rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}