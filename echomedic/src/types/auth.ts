// Mulige roller for bruker
export type UserRole = "leder" | "leser";

// Brukerobjekt vi lagrer i appen
export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
};

// Verdier som tilbys via AuthContext
export type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// State for redirect når ProtectedRoute sender til /login
export type LoginRedirectState = {
  from?: {
    pathname: string;
  };
};
