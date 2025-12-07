import { useEffect, useState } from "react";
import type { Risk } from "../types/risk";
import { fetchRisks } from "../services/riskService";

export const useRisks = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRisks();
        if (isMounted) {
          setRisks(result);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Kunne ikke hente risikoer");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { risks, loading, error, setRisks };
};
