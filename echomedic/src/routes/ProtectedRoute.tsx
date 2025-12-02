import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { LoginRedirectState } from "../context/authTypes";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    const state: LoginRedirectState = {
      from: { pathname: location.pathname },
    };

    return (
      <Navigate
        to="/login"
        replace
        state={state}
      />
    );
  }

  return <>{children}</>;
}
