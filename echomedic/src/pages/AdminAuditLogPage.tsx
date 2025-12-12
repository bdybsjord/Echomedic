import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseDb } from "../lib/firebase";
import { useAuth } from "../context/useAuth";
import type { AuditLogEntry } from "../types/audit";

interface FirestoreAuditLog {
  action: string;
  riskId: string;
  description: string;
  userId: string;
  userEmail: string | null;
  before?: unknown;
  after?: unknown;
  timestamp?: { seconds: number; nanoseconds: number };
}

export const AdminAuditLogPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      const ref = collection(firebaseDb, "auditLogs");
      const q = query(ref, orderBy("timestamp", "desc"), limit(100));
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
          timestamp: data.timestamp
            ? new Date(data.timestamp.seconds * 1000)
            : new Date(),
        };
      });

      setLogs(mapped);
      setIsLoading(false);
    };

    void load();
  }, [isAdmin]);

  if (!user) {
    return <p className="text-slate-300">Du må være innlogget.</p>;
  }

  if (!isAdmin) {
    return <p className="text-slate-300">Du har ikke tilgang til audit-loggen.</p>;
  }

  if (isLoading) {
    return <p className="text-slate-300">Laster logg…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Audit-logg (hendelsesspor)
        </h1>
        <p className="text-sm text-slate-400">
          Viser de siste hendelsene på risikoer (opprettet / endret) med bruker
          og tidspunkt.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-slate-400">Tid</th>
              <th className="px-4 py-3 text-left text-slate-400">Hendelse</th>
              <th className="px-4 py-3 text-left text-slate-400">Risiko-ID</th>
              <th className="px-4 py-3 text-left text-slate-400">Bruker</th>
              <th className="px-4 py-3 text-left text-slate-400">Beskrivelse</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-800">
                <td className="px-4 py-2 text-slate-200">
                  {log.timestamp.toLocaleString("nb-NO")}
                </td>
                <td className="px-4 py-2 text-slate-200">{log.action}</td>
                <td className="px-4 py-2 text-slate-200">{log.riskId}</td>
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
    </div>
  );
};
