import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Si no hay usuario, redirigir a login (podría ser manejado por PrivateRoute también)
  // Si hay usuario pero no es admin, redirigir a home o unauthorized
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
