import { createContext } from "react";

export type AuthUser = {
  email: string;
  name?: string;
};

export type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
