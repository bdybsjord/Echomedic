import { useEffect, useState } from "react";
import type { Control } from "../types/control";
import { fetchControls } from "../services/controlService";

export const useControls = () => {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchControls();
        if (isMounted) {
          setControls(result);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Kunne ikke hente sikkerhetskontroller");
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

  return { controls, loading, error, setControls };
};
