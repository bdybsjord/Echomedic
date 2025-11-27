import { useAuth } from "../context/useAuth";

export default function Topbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Risiko-dashboard</h1>
      {isLoggedIn && (
        <button
          onClick={logout}
          className="text-sm text-blue-600 hover:underline"
        >
          Logg ut
        </button>
      )}
    </header>
  );
}
