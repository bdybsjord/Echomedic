import { useEffect, useState } from "react";
import type { Policy } from "../types/policy";
import { fetchPolicies } from "../services/policyService";

export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchPolicies();
        if (isMounted) {
          setPolicies(result);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Kunne ikke hente policyer");
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

  return { policies, loading, error, setPolicies };
};
