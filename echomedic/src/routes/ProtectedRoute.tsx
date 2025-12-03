import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type LoginRedirectState = {
  from?: {
    pathname: string;
  };
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-cyan-400" />
          <p className="text-sm text-slate-400">Verifiserer pålogging …</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    const state: LoginRedirectState = {
      from: { pathname: location.pathname },
    };
    return <Navigate to="/login" replace state={state} />;
  }

  return <>{children}</>;
}
