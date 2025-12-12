import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiskForm } from "../components/risk/RiskForm";
import { createRisk, type RiskInput } from "../services/riskService";
import { useAuth } from "../context/useAuth";
import { ErrorBanner } from "../components/common/ErrorBanner";

export const NewRiskPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const isReader = user?.role === "leser";

  if (!user) {
    return (
      <p className="text-sm text-slate-300">
        Du må være innlogget for å opprette en risiko.
      </p>
    );
  }

  if (isReader) {
    return (
      <p className="text-sm text-slate-300">
        Du har kun lesetilgang og kan ikke opprette nye risikoer.
      </p>
    );
  }

  const handleSubmit = async (values: RiskInput) => {
    try {
      await createRisk(values, user);
      navigate("/risks");
    } catch (err) {
      console.error(err);
      setError("Kunne ikke opprette risiko. Prøv igjen.");
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-slate-50">Ny risiko</h1>
        <p className="text-sm text-slate-400">
          Registrer en ny risiko i Echomedic sitt risikoregister.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* FORM PANEL */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6">
        <RiskForm onSubmit={handleSubmit} submitLabel="Opprett risiko" />
      </div>
    </div>
  );
};
