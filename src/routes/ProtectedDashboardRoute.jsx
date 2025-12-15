import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedDashboardRoute({ children }) {
  const { rol, loadingRol } = useAuth();

  if (loadingRol) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="text-slate-500 text-sm">Cargando permisos...</span>
      </div>
    );
  }

  if (!rol) {
    return <Navigate to="/" replace />;
  }

  if (rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}