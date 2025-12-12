import { useState } from "react";
import type { FormEvent } from "react";
import type { RiskInput } from "../../services/riskService";
import type { RiskStatus } from "../../types/risk";
import { ErrorBanner } from "../common/ErrorBanner";

interface Props {
  initial?: Partial<RiskInput>;
  onSubmit: (values: RiskInput) => Promise<void>;
  submitLabel?: string;
}

export const RiskForm = ({
  initial,
  onSubmit,
  submitLabel = "Lagre",
}: Props) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [likelihood, setLikelihood] = useState(initial?.likelihood ?? 3);
  const [consequence, setConsequence] = useState(initial?.consequence ?? 3);
  const [measures, setMeasures] = useState(initial?.measures ?? "");
  const [owner, setOwner] = useState(initial?.owner ?? "");
  const [status, setStatus] = useState<RiskStatus>(initial?.status ?? "Open");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Tittel er påkrevd");
      return;
    }
    if (!owner.trim()) {
      setError("Eier er påkrevd");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        likelihood,
        consequence,
        measures: measures.trim() || undefined,
        owner: owner.trim(),
        status,
      });
    } catch (err) {
      console.error(err);
      setError("Noe gikk galt ved lagring av risiko.");
    } finally {
      setSubmitting(false);
    }
  };

  const score = likelihood * consequence;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Tittel<span className="text-rose-400">*</span>
        </label>
        <input
          className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Beskrivelse
        </label>
        <textarea
          className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Sannsynlighet (1–5)
          </label>
          <select
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={likelihood}
            onChange={(e) => setLikelihood(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Konsekvens (1–5)
          </label>
          <select
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={consequence}
            onChange={(e) => setConsequence(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Score
          </label>
          <div className="mt-2 text-sm font-mono font-semibold text-slate-100">
            {score}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Beregnes som sannsynlighet × konsekvens.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Tiltak
        </label>
        <textarea
          className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
          value={measures}
          onChange={(e) => setMeasures(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Eier/ansvarlig<span className="text-rose-400">*</span>
          </label>
          <input
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as RiskStatus)}
          >
            <option value="Open">Åpen</option>
            <option value="InProgress">Under behandling</option>
            <option value="Closed">Lukket</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Lagrer…" : submitLabel}
        </button>
      </div>
    </form>
  );
};
