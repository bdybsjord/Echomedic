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
import type { AuthUser, LoginRedirectState, UserRole } from "../types/auth";

type AuthProviderProps = {
  children: React.ReactNode;
};

// ADMIN-WHITELIST
const ADMIN_EMAILS = [
  "bedy002@egms.no",
  "admin@echomedic.no",
];

// LESER-WHITELIST – kun lesetilgang
const READER_EMAILS = [
  "bruker@echomedic.no",
];

// Mapper Firebase User: AuthUser med rollelogikk
function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;

  const email = user.email ?? "";

  let role: UserRole;

  if (ADMIN_EMAILS.includes(email)) {
    role = "admin";
  } else if (READER_EMAILS.includes(email)) {
    role = "leser";
  } else {
    role = "leder";
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;

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
