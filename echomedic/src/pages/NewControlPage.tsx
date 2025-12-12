import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ControlStatus } from "../types/control";
import { createControl, type ControlInput } from "../services/controlService";
import { useAuth } from "../context/useAuth";
import { ErrorBanner } from "../components/common/ErrorBanner";

const defaultStatus: ControlStatus = "Planned";

export default function NewControlPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ControlInput>({
    isoId: "",
    title: "",
    description: "",
    status: defaultStatus,
    justification: "",
    owner: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReader = user?.role === "leser";

  if (!user) {
    return (
      <p className="text-sm text-slate-300">
        Du må være innlogget for å opprette en kontroll.
      </p>
    );
  }

  if (isReader) {
    return (
      <p className="text-sm text-slate-300">
        Du har kun lesetilgang og kan ikke opprette nye kontroller.
      </p>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createControl(
        {
          isoId: form.isoId.trim(),
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          justification: form.justification?.trim() || undefined,
          owner: form.owner?.trim() || undefined,
        },
        user, // sender hele AuthUser til audit-loggen
      );

      navigate("/controls");
    } catch (err) {
      console.error(err);
      setError("Kunne ikke opprette kontroll. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-50">
          Ny sikkerhetskontroll
        </h1>
        <p className="text-sm text-slate-400">
          Registrer en ny kontroll i Statement of Applicability (SoA).
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
              ISO-ID (f.eks. A.9.2.3)
            </label>
            <input
              name="isoId"
              value={form.isoId}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Eier
            </label>
            <input
              name="owner"
              value={form.owner}
              onChange={handleChange}
              placeholder="F.eks. Sikkerhetsleder"
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Kontrollnavn
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
            Beskrivelse
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
              <option value="Implemented">Implementert</option>
              <option value="Planned">Delvis / planlagt</option>
              <option value="NotRelevant">Ikke relevant</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Begrunnelse (valgfritt)
            </label>
            <textarea
              name="justification"
              value={form.justification ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/controls")}
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400 disabled:opacity-60"
          >
            {isSubmitting ? "Lagrer…" : "Opprett kontroll"}
          </button>
        </div>
      </form>
    </div>
  );
}
