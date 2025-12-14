import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePolicies } from "../../hooks/usePolicies";
import PolicyStatusBadge from "../../components/policy/PolicyStatusBadge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { useAuth } from "../../context/useAuth";
import { deletePolicy } from "../../services/policyService";
import { mockPolicies } from "../../data/mockPolicies";

export default function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { policies, loading, error } = usePolicies();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  // Finn policy fra Firestore først
  let policy = policies.find((p) => p.id === id);

  // Hvis ikke funnet i Firestore – sjekk mockPolicies
  if (!policy && id) {
    const mock = mockPolicies.find((m) => m.id === id);
    if (mock) {
      policy = mock;
    }
  }

  // Hindrer at vi prøver å slette mock-policyer
  const isMockPolicy = id ? mockPolicies.some((m) => m.id === id) : false;

  const handleDelete = async () => {
    if (!policy || !user || isMockPolicy) return;

    const confirmed = window.confirm(
      `Er du sikker på at du vil slette policyen "${policy.title}"?`,
    );
    if (!confirmed) return;

    try {
      setDeleteError(null);
      await deletePolicy(policy.id, user);
      navigate("/policies");
    } catch (err) {
      console.error(err);
      setDeleteError("Kunne ikke slette policy. Prøv igjen.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="space-y-4">
        <Link
          to="/policies"
          className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100"
        >
          ← Tilbake til policyoversikt
        </Link>
        <ErrorBanner message={error ?? "Fant ikke policy"} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">
            <Link to="/policies" className="text-slate-300 hover:text-slate-50">
              Policyer
            </Link>{" "}
            /{" "}
            <span className="text-slate-500">
              {policy.category} · v{policy.version}
            </span>
          </p>

          <h1 className="text-2xl font-semibold text-slate-50">
            {policy.title}
          </h1>
        </div>

        <div className="flex flex-col items-end gap-2">
          <PolicyStatusBadge status={policy.status} />
          <p className="text-xs text-slate-400">
            Sist oppdatert{" "}
            {policy.updatedAt.toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {canManage && !isMockPolicy && (
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate(`/policies/${policy.id}/edit`)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900"
              >
                Rediger
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
              >
                Slett
              </button>
            </div>
          )}

          {isMockPolicy && (
            <p className="text-[10px] text-slate-500">
              Demo-policy (mock) – kan ikke slettes.
            </p>
          )}
        </div>
      </div>

      {deleteError && <ErrorBanner message={deleteError} />}

      {/* Info-kort */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Kategori
          </h2>
          <p className="text-sm text-slate-50">{policy.category}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Versjon
          </h2>
          <p className="text-sm text-slate-50">{policy.version}</p>
          <p className="text-xs text-slate-500 mt-1">
            Opprettet{" "}
            {policy.createdAt.toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Formål
          </h2>
          <p className="text-xs text-slate-300">
            Denne policyen beskriver retningslinjer for tilgang,
            overvåking eller hendelseshåndtering i Echomedic, i tråd med ISO
            27001, Normen og GDPR.
          </p>
        </div>
      </section>

      {/* Policy-body */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 px-6 py-6 leading-relaxed text-sm text-slate-200 whitespace-pre-wrap">
        {policy.body}
      </section>

      <div className="pt-2">
        <Link
          to="/policies"
          className="inline-flex items-center text-xs text-slate-400 hover:text-slate-100"
        >
          ← Tilbake til policyoversikt
        </Link>
      </div>
    </div>
  );
}
