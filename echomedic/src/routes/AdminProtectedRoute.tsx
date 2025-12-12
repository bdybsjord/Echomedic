import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // må være innlogget og ha admin-rolle
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
