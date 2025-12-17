import { useEffect, useMemo, useState } from "react";
import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import { useAuth } from "../context/useAuth";
import Card from "../components/ui/Card";
import type { AuditLogEntry } from "../types/audit";

interface FirestoreAuditLog {
  action: string;
  riskId: string;
  description: string;
  userId: string;
  userEmail: string | null;
  before?: unknown;
  after?: unknown;
  /**
   * Firestore returnerer vanligvis Timestamp,
   * men ved eksport/mock kan den være serialisert {seconds, nanoseconds}.
   */
  timestamp?: Timestamp | { seconds: number; nanoseconds: number };
}

function toDate(
  ts?: Timestamp | { seconds: number; nanoseconds: number }
): Date {
  if (!ts) return new Date();

  if (ts instanceof Timestamp) {
    return ts.toDate();
  }

  return new Date(ts.seconds * 1000);
}

export const AdminAuditLogPage = () => {
  const { user } = useAuth();

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const ref = collection(firebaseDb, "auditLogs");
        const q = query(ref, orderBy("timestamp", "desc"), limit(200));
        const snapshot = await getDocs(q);

        const mapped: AuditLogEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreAuditLog;

          return {
            id: docSnap.id,
            action: data.action as AuditLogEntry["action"],
            riskId: data.riskId,
            description: data.description,
            userId: data.userId,
            userEmail: data.userEmail,
            before: data.before,
            after: data.after,
            timestamp: toDate(data.timestamp),
          };
        });

        setLogs(mapped);
      } catch {
        setError(
          "Kunne ikke laste audit-logg. Sjekk Firestore-regler og tilgang."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [isAdmin]);

  const actions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(String(l.action)));
    return ["all", ...Array.from(set).sort()];
  }, [logs]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return logs.filter((l) => {
      if (actionFilter !== "all" && String(l.action) !== actionFilter) {
        return false;
      }
      if (!s) return true;

      return (
        String(l.action).toLowerCase().includes(s) ||
        (l.riskId ?? "").toLowerCase().includes(s) ||
        (l.userEmail ?? "").toLowerCase().includes(s) ||
        (l.userId ?? "").toLowerCase().includes(s) ||
        (l.description ?? "").toLowerCase().includes(s)
      );
    });
  }, [logs, search, actionFilter]);

  if (!user) {
    return <p className="text-slate-300">Du må være innlogget.</p>;
  }

  if (!isAdmin) {
    return (
      <p className="text-slate-300">Du har ikke tilgang til audit-loggen.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Audit-logg (hendelsesspor)
        </h1>
        <p className="text-sm text-slate-400">
          Viser siste hendelser på risikoer (opprettet / endret) med bruker og
          tidspunkt.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-slate-400">Søk</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søk på action, risiko-id, bruker, beskrivelse…"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400">Handling</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? "Alle" : a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <p className="text-slate-300">Laster logg…</p>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 text-sm text-rose-100">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
          Ingen hendelser å vise.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-slate-400">Tid</th>
                <th className="px-4 py-3 text-left text-slate-400">Hendelse</th>
                <th className="px-4 py-3 text-left text-slate-400">Risiko-ID</th>
                <th className="px-4 py-3 text-left text-slate-400">Bruker</th>
                <th className="px-4 py-3 text-left text-slate-400">
                  Beskrivelse
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-slate-800 hover:bg-slate-950/40"
                >
                  <td className="whitespace-nowrap px-4 py-2 text-slate-200">
                    {log.timestamp.toLocaleString("nb-NO")}
                  </td>
                  <td className="px-4 py-2 text-slate-200">
                    {String(log.action)}
                  </td>
                  <td className="px-4 py-2 font-mono text-slate-200">
                    {log.riskId}
                  </td>
                  <td className="px-4 py-2 text-slate-200">
                    {log.userEmail ?? log.userId}
                  </td>
                  <td className="px-4 py-2 text-slate-300">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
