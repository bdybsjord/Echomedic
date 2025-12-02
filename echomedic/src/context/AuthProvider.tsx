import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";
import type { LoginRedirectState } from "./authTypes";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;

  const login = (email: string) => {
    const trimmed = email.trim();

    const demoUser: AuthUser = {
      email: trimmed || "leder@echomedic.no",
      name: "Echomedic-leder",
    };

    setUser(demoUser);

    const state = location.state as LoginRedirectState | null;
    const from = state?.from?.pathname ?? "/";

    navigate(from, { replace: true });
  };

  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
