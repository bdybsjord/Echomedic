import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { RiskInput } from "../../services/riskService";
import type { RiskCategory, RiskStatus, RiskTreatment } from "../../types/risk";
import { ErrorBanner } from "../common/ErrorBanner";

interface Props {
  initial?: Partial<RiskInput>;
  onSubmit: (values: RiskInput) => Promise<void>;
  submitLabel?: string;
}

const CATEGORIES = ["Teknisk", "Prosess", "Personell", "Juridisk"] as const;
const TREATMENTS = ["Redusere", "Unngå", "Overføre", "Akseptere"] as const;

const normalizeCategory = (value: unknown): RiskCategory => {
  return CATEGORIES.includes(value as RiskCategory) ? (value as RiskCategory) : "Teknisk";
};

const normalizeTreatment = (value: unknown): RiskTreatment => {
  return TREATMENTS.includes(value as RiskTreatment) ? (value as RiskTreatment) : "Redusere";
};

export const RiskForm = ({ initial, onSubmit, submitLabel = "Lagre" }: Props) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [likelihood, setLikelihood] = useState<number>(initial?.likelihood ?? 3);
  const [consequence, setConsequence] = useState<number>(initial?.consequence ?? 3);
  const [measures, setMeasures] = useState(initial?.measures ?? "");
  const [owner, setOwner] = useState(initial?.owner ?? "");
  const [status, setStatus] = useState<RiskStatus>((initial?.status as RiskStatus) ?? "Open");

  const [category, setCategory] = useState<RiskCategory>(
    normalizeCategory(initial?.category),
  );

  const [treatment, setTreatment] = useState<RiskTreatment>(
    normalizeTreatment(initial?.treatment),
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = useMemo(() => likelihood * consequence, [likelihood, consequence]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Tittel er påkrevd");
    if (!owner.trim()) return setError("Eier er påkrevd");

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
        category,
        treatment,
      });
    } catch (err) {
      console.error(err);
      setError("Noe gikk galt ved lagring av risiko.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorBanner message={error} />}

      {/* Tittel */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-300">
          Tittel<span className="text-rose-400">*</span>
        </label>
        <input
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Beskrivelse */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-300">Beskrivelse</label>
        <textarea
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Kategori + Strategi */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Kategori</label>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={category}
            onChange={(e) => setCategory(normalizeCategory(e.target.value))}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">Brukes til rapportering og dashboard.</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Behandlingsstrategi
          </label>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={treatment}
            onChange={(e) => setTreatment(normalizeTreatment(e.target.value))}
          >
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">Unngå / Redusere / Overføre / Akseptere</p>
        </div>
      </div>

      {/* Sannsynlighet / Konsekvens / Score */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Sannsynlighet (1–5)
          </label>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Konsekvens (1–5)
          </label>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
          <label className="mb-1 block text-xs font-medium text-slate-300">Score</label>
          <div className="mt-2 text-sm font-mono font-semibold text-slate-100">{score}</div>
          <p className="mt-1 text-[11px] text-slate-500">Sannsynlighet × konsekvens</p>
        </div>
      </div>

      {/* Tiltak */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-300">Tiltak</label>
        <textarea
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
          value={measures}
          onChange={(e) => setMeasures(e.target.value)}
        />
      </div>

      {/* Eier + Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Eier/ansvarlig<span className="text-rose-400">*</span>
          </label>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Status</label>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as RiskStatus)}
          >
            <option value="Open">Åpen</option>
            <option value="InProgress">Under behandling</option>
            <option value="Closed">Lukket</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
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
