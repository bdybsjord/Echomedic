// Typen for hva vi legger i location.state når vi redirecter til /login
// Brukes i ProtectedRoute for å vite hvor vi skal sende brukeren tilbake.
export interface LoginRedirectState {
  from?: {
    pathname: string;
  };
  message?: string;
}
