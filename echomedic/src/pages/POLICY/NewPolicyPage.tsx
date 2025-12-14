import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { createPolicy, type PolicyInput } from "../../services/policyService";
import type { PolicyStatus } from "../../types/policy";

export default function NewPolicyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isReader = user?.role === "leser";

  const [form, setForm] = useState<PolicyInput>({
    title: "",
    category: "Tilgang",
    version: "1.0",
    body: "",
    status: "Gyldig" as PolicyStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <p className="text-sm text-slate-300">
        Du må være innlogget for å opprette en policy.
      </p>
    );
  }

  if (isReader) {
    return (
      <p className="text-sm text-slate-300">
        Du har kun lesetilgang og kan ikke opprette nye policyer.
      </p>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // viktig: send user inn (audit)
      const id = await createPolicy(
        {
          title: form.title.trim(),
          category: form.category.trim(),
          version: form.version.trim(),
          body: form.body.trim(),
          status: form.status,
        },
        user,
      );

      navigate(`/policies/${id}`);
    } catch (err) {
      console.error("createPolicy failed:", err);
      setError("Kunne ikke opprette policy. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">Ny policy</h1>
        <p className="text-sm text-slate-400">
          Opprett en ny sikkerhetspolicy.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4"
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kategori
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="Tilgang">Tilgang</option>
              <option value="Sikker drift">Sikker drift</option>
              <option value="Endringsstyring">Endringsstyring</option>
              <option value="Beredskap">Beredskap</option>
            </select>
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
            required
            rows={10}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/policies")}
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400 disabled:opacity-60"
          >
            {isSubmitting ? "Lagrer…" : "Opprett policy"}
          </button>
        </div>
      </form>
    </div>
  );
}
