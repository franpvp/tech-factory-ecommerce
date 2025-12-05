import { Navigate } from "react-router-dom";
import { useAzureUser } from "../hooks/useAzureUser";

export default function ProtectedDashboardRoute({ children }) {
  const user = useAzureUser();

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}