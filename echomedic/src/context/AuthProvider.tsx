import { useEffect, useState } from "react";
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


type AuthProviderProps = {
  children: React.ReactNode;
};

// Mapper Firebase User til vår AuthUser med rolle
function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;

  // Rolle kan hentes fra Firestore senere – nå default "leder"
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: "leder",
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;

  // Hold appen og Firebase i sync
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
      const cred = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      setUser(mapUser(cred.user));

      const state = location.state as LoginRedirectState | null;
      const from = state?.from?.pathname ?? "/";
      navigate(from, { replace: true });
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
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
