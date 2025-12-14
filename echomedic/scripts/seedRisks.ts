import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

type RiskLevel = "Low" | "Medium" | "High";
type RiskStatus = "Open" | "InProgress" | "Closed";

type RiskCategory = "Teknisk" | "Prosess" | "Personell" | "Juridisk";
type RiskTreatment = "Redusere" | "Unngå" | "Overføre" | "Akseptere";

type SeedRisk = {
  reportId: string;
  title: string;
  description?: string;
  likelihood: number; // 1–5
  consequence: number; // 1–5
  measures?: string;
  owner: string;
  status: RiskStatus;
  category: RiskCategory;
  treatment: RiskTreatment;
};

const serviceAccountPath = path.resolve("scripts/serviceAccount.json");
const seedPath = path.resolve("scripts/risks.seed.json");

function calculateScore(likelihood: number, consequence: number) {
  return likelihood * consequence;
}

function calculateLevel(score: number): RiskLevel {
  if (score >= 15) return "High";
  if (score >= 8) return "Medium";
  return "Low";
}

function assertRange15(value: number, field: string) {
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    throw new Error(`${field} må være 1–5. Fikk: ${value}`);
  }
}

async function main() {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Mangler ${serviceAccountPath}. Last ned service account JSON fra Firebase Console.`);
  }
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Mangler ${seedPath}. Lag risks.seed.json først.`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  const seed: SeedRisk[] = JSON.parse(fs.readFileSync(seedPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  const risksCol = db.collection("risks");

  console.log(`Seeder ${seed.length} risikoer...`);

  for (const r of seed) {
    assertRange15(r.likelihood, "likelihood");
    assertRange15(r.consequence, "consequence");

    const score = calculateScore(r.likelihood, r.consequence);
    const level = calculateLevel(score);
    const nowTs = Timestamp.now();

    const q = await risksCol.where("reportId", "==", r.reportId).limit(1).get();

    const payload = {
      reportId: r.reportId,
      title: r.title,
      description: r.description ?? null,
      likelihood: r.likelihood,
      consequence: r.consequence,
      score,
      level,
      status: r.status,
      owner: r.owner,
      measures: r.measures ?? null,
      category: r.category,
      treatment: r.treatment,
      updatedAt: nowTs,
    };

    if (q.empty) {
      const docRef = await risksCol.add({
        ...payload,
        createdAt: nowTs,
      });
      console.log(`✅ created ${r.reportId} -> ${docRef.id}`);
    } else {
      const docRef = q.docs[0].ref;
      await docRef.set(payload, { merge: true });
      console.log(`♻️ updated ${r.reportId} -> ${docRef.id}`);
    }
  }

  console.log("Ferdig ✅");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed feilet:", err);
  process.exit(1);
});
