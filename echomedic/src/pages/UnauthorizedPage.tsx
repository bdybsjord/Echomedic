import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/useAuth";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen echomedic-gradient flex items-center justify-center px-4 py-10">
      <Card className="max-w-lg w-full">
        <div className="text-center">
          <div className="text-5xl mb-3">🚫</div>
          <h1 className="text-2xl font-semibold text-slate-50">Ingen tilgang</h1>
          <p className="mt-2 text-sm text-slate-300">
            Du har ikke rettigheter til å åpne denne siden.
          </p>

          {user?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Innlogget som:{" "}
              <span className="font-mono text-slate-200">{user.email}</span>
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={() => navigate(-1)}>Gå tilbake</Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Til dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
