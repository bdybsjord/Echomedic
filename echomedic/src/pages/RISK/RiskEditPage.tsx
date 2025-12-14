import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchRiskById, updateRisk, type RiskInput } from "../../services/riskService";
import type { Risk } from "../../types/risk";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { RiskForm } from "../../components/risk/RiskForm";
import { mockRisks } from "../../data/mockRisks";
import { mapMockRiskToDomain } from "../../adapters/mockRiskAdapter";
import { useAuth } from "../../context/useAuth";

export default function RiskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  // Hindre redigering av mock-data
  const isMock = id ? mockRisks.some((m) => m.id === id) : false;

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const fetched = await fetchRiskById(id);

        if (fetched) {
          setRisk(fetched);
        } else {
          const mock = mockRisks.find((m) => m.id === id);
          if (mock) {
            setRisk(mapMockRiskToDomain(mock));
          } else {
            setLoadError("Fant ikke risiko");
          }
        }
      } catch {
        setLoadError("Kunne ikke hente risiko");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleSubmit = async (values: RiskInput) => {
    if (!risk || !user || isMock) return;

    try {
      await updateRisk(risk.id, values, user);
      navigate(`/risks/${risk.id}`);
    } catch (error) {
      console.error(error);
      setLoadError("Kunne ikke oppdatere risiko");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (loadError || !risk) {
    return (
      <div className="space-y-4">
        <Link
          to="/risks"
          className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100"
        >
          ← Tilbake til register
        </Link>
        <ErrorBanner message={loadError ?? "Fant ikke risiko"} />
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="space-y-4">
        <Link
          to={`/risks/${risk.id}`}
          className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100"
        >
          ← Tilbake
        </Link>
        <ErrorBanner message="Du har kun lesetilgang og kan ikke redigere risikoer." />
      </div>
    );
  }

  if (isMock) {
    return (
      <div className="space-y-4">
        <Link
          to={`/risks/${risk.id}`}
          className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100"
        >
          ← Tilbake
        </Link>
        <ErrorBanner message="Dette er en demo/mock-risiko og kan ikke redigeres." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <p className="text-xs font-mono text-slate-500">{risk.id}</p>
        <h1 className="text-xl font-semibold text-slate-50">
          Rediger risiko
        </h1>
        <p className="text-sm text-slate-400">
          Oppdater detaljer og tiltak for risikoen.
        </p>
      </div>

      <RiskForm
        initial={risk}
        submitLabel="Oppdater risiko"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
