import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { AuthContext } from "./AuthContext";
import type { AuthUser, LoginRedirectState } from "../types/auth";
import { roleFromEmail } from "./role";

type AuthProviderProps = {
  children: React.ReactNode;
};

// Mapper Firebase User: vår AuthUser med rolle (fra e-post)
function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: roleFromEmail(user.email),
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useMemo(() => !!user, [user]);

  // Sync med Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (fbUser) => {
      setUser(mapUser(fbUser));
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setUser(mapUser(cred.user));

      const state = location.state as LoginRedirectState | null;
      const from = state?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(firebaseAuth);
      setUser(null);
      navigate("/login", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
