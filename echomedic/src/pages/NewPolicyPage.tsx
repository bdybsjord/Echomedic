import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchPolicyById, deletePolicy } from "../services/policyService";
import type { Policy } from "../types/policy";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";
import PolicyStatusBadge from "../components/PolicyStatusBadge";
import { useAuth } from "../context/useAuth";

export default function PoliciesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const p = await fetchPolicyById(id);
        if (!p) {
          setError("Fant ikke policy");
        } else {
          setPolicy(p);
        }
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente policy");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleDelete = async () => {
    if (!policy || !user) return;

    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne policyen? Dette kan ikke angres.",
    );
    if (!confirmed) return;

    try {
      await deletePolicy(policy.id, user);
      navigate("/policies");
    } catch (err) {
      console.error(err);
      setError("Kunne ikke slette policy.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!policy) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-mono text-slate-500">{policy.id}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-50">
            {policy.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>Kategori: {policy.category}</span>
            <span>Versjon: {policy.version}</span>
            <span>
              Sist oppdatert:{" "}
              {policy.updatedAt.toLocaleDateString("nb-NO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <PolicyStatusBadge status={policy.status} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/policies"
            className="text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            ← Tilbake til oversikt
          </Link>

          {canManage && (
            <>
              {/* Edit-side kan du lage senere: /policies/:id/edit */}
              <button
                type="button"
                onClick={() => navigate(`/policies/${policy.id}/edit`)}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
              >
                Rediger
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
              >
                Slett
              </button>
            </>
          )}
        </div>
      </header>

      <section className="glass-panel rounded-3xl border border-slate-800 p-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-100">
          Policyinnhold
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
          {policy.body}
        </p>
      </section>
    </div>
  );
}
