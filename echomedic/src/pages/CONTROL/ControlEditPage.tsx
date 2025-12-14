import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useControls } from "../../hooks/useControls";
import type { Control, ControlStatus } from "../../types/control";
import { useAuth } from "../../context/useAuth";
import { updateControl } from "../../services/controlService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorBanner } from "../../components/common/ErrorBanner";

type ControlFormState = {
  isoId: string;
  title: string;
  description: string;
  status: ControlStatus;
  justification: string;
  owner: string;
};

export default function ControlEditPage() {
  const { id } = useParams<{ id: string }>();
  const { controls, loading, error } = useControls();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  const control: Control | undefined = useMemo(
    () => controls.find((c) => c.id === id),
    [controls, id],
  );

  const [form, setForm] = useState<ControlFormState | null>(
    control
      ? {
          isoId: control.isoId,
          title: control.title,
          description: control.description,
          status: control.status,
          justification: control.justification ?? "",
          owner: control.owner ?? "",
        }
      : null,
  );

  // Oppdater form når kontroll lastes inn async
  if (!form && control) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setForm({
      isoId: control.isoId,
      title: control.title,
      description: control.description,
      status: control.status,
      justification: control.justification ?? "",
      owner: control.owner ?? "",
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
      await updateControl(
        id,
        {
          isoId: form.isoId.trim(),
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          justification: form.justification.trim() || undefined,
          owner: form.owner.trim() || undefined,
        },
        user,
      );

      navigate("/controls");
    } catch (err) {
      console.error(err);
      alert("Kunne ikke oppdatere kontroll. Prøv igjen.");
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-slate-300">
        Du må være innlogget for å redigere en kontroll.
      </p>
    );
  }

  if (isReader) {
    return (
      <p className="text-sm text-slate-300">
        Du har kun lesetilgang og kan ikke redigere kontroller.
      </p>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !control || !form) {
    return <ErrorBanner message={error ?? "Fant ikke kontroll"} />;
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">
            <Link
              to="/controls"
              className="text-slate-300 hover:text-slate-50"
            >
              ← Tilbake til oversikt
            </Link>
          </p>
          <h1 className="text-xl font-semibold text-slate-50">
            Rediger sikkerhetskontroll
          </h1>
          <p className="text-sm text-slate-400">
            Oppdater informasjon for valgt kontroll i SoA.
          </p>
        </div>
      </div>

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
              value={form.justification}
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
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400"
          >
            Lagre endringer
          </button>
        </div>
      </form>
    </div>
  );
}
