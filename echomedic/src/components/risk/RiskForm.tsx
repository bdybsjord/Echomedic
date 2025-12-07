import { useState } from "react";
import type { FormEvent } from "react";
import type { RiskInput } from "../../services/riskService";
import type { RiskStatus } from "../../types/risk";

interface Props {
  initial?: Partial<RiskInput>;
  onSubmit: (values: RiskInput) => Promise<void>;
  submitLabel?: string;
}

export const RiskForm = ({ initial, onSubmit, submitLabel = "Lagre" }: Props) => {
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
      setError("Noe gikk galt ved lagring av risiko");
    } finally {
      setSubmitting(false);
    }
  };

  const score = likelihood * consequence;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tittel<span className="text-red-500">*</span>
        </label>
        <input
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sannsynlighet (1–5)
          </label>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
          <label className="block text-sm font-medium text-gray-700">
            Konsekvens (1–5)
          </label>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
          <label className="block text-sm font-medium text-gray-700">Score</label>
          <div className="mt-2 text-sm font-semibold text-gray-900">{score}</div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tiltak</label>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          rows={3}
          value={measures}
          onChange={(e) => setMeasures(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Eier/ansvarlig<span className="text-red-500">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as RiskStatus)}
          >
            <option value="Open">Åpen</option>
            <option value="InProgress">Under behandling</option>
            <option value="Closed">Lukket</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Lagrer..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
