import { createContext } from "react";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
