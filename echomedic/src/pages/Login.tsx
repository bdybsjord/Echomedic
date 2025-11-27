import { useAuth } from "../context/useAuth";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Logg inn</h2>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={login}
      >
        Logg inn som demo-bruker
      </button>
    </div>
  );
}
