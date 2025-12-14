import { Link, useNavigate, useParams } from "react-router-dom";
import { usePolicies } from "../../hooks/usePolicies";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { updatePolicy } from "../../services/policyService";
import type { PolicyStatus } from "../../types/policy";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorBanner } from "../../components/common/ErrorBanner";

type PolicyFormState = {
  title: string;
  category: string;
  version: string;
  body: string;
  status: PolicyStatus;
};

export default function PolicyEditPage() {
  const { id } = useParams<{ id: string }>();
  const { policies, loading, error } = usePolicies();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  const policy = policies.find((p) => p.id === id);

  const [form, setForm] = useState<PolicyFormState | null>(
    policy
      ? {
          title: policy.title,
          category: policy.category,
          version: policy.version,
          body: policy.body,
          status: policy.status,
        }
      : null,
  );

  // sync når policy dukker opp async
  if (!form && policy) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setForm({
      title: policy.title,
      category: policy.category,
      version: policy.version,
      body: policy.body,
      status: policy.status,
    });
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form || !user || !canManage) return;

    try {
      await updatePolicy(
        id,
        {
          title: form.title.trim(),
          category: form.category.trim(),
          version: form.version.trim(),
          body: form.body,
          status: form.status,
        },
        user,
      );
      navigate(`/policies/${id}`);
    } catch (err) {
      console.error(err);
      alert("Kunne ikke oppdatere policy. Prøv igjen.");
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-slate-300">
        Du må være innlogget for å redigere policyer.
      </p>
    );
  }

  if (isReader) {
    return (
      <p className="text-sm text-slate-300">
        Du har kun lesetilgang og kan ikke redigere policyer.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !policy || !form) {
    return <ErrorBanner message={error ?? "Fant ikke policy"} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">
            <Link
              to={`/policies/${policy.id}`}
              className="text-slate-300 hover:text-slate-50"
            >
              ← Tilbake til detaljside
            </Link>
          </p>

          <h1 className="text-2xl font-semibold text-slate-50">
            Rediger policy
          </h1>
          <p className="text-sm text-slate-400">
            Oppdater innhold, versjon og status for denne policyen.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-800 bg-slate-950/70 px-6 py-6 space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tittel
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kategori
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Versjon
            </label>
            <input
              name="version"
              value={form.version}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="Gyldig">Gyldig</option>
              <option value="Under revisjon">Under revisjon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Innhold
          </label>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            rows={10}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/policies/${policy.id}`)}
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400"
          >
            Lagre endringer
          </button>
        </div>
      </form>
    </div>
  );
}
