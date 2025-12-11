import { Link, useParams } from "react-router-dom";
import { usePolicies } from "../hooks/usePolicies";
import PolicyStatusBadge from "../components/PolicyStatusBadge";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";

export default function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { policies, loading, error } = usePolicies();

  // Finn aktuell policy basert på id fra URL
  const policy = policies.find((p) => p.id === id);

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
        </div>
      </div>

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
