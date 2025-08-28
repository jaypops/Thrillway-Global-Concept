import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import Loader from "./Loader";

interface ProtectedRoutesProps {
  children: ReactNode;
}

function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated === null) {
    return <Loader />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default ProtectedRoutes;
