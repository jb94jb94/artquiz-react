// src/hooks/useUserStats.ts
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export type UserStatRow = {
  artist_name: string;
  correct: number;
  not_recognized: number;
  falsely_guessed: number;
  hit_rate: number;
  precision_value: number;
  not_recognized_detail: Record<string, number> | null;
  falsely_guessed_detail: Record<string, number> | null;
};

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStats([]);
      setLoading(false);
      return;
    }

    async function fetchStats() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc("get_detailed_user_stats", {
        uid: user!.id,
      });

      if (error) {
        setError(error.message);
        setStats([]);
      } else {
        setStats(data || []);
      }

      setLoading(false);
    }

    fetchStats();
  }, [user]);

  return { stats, loading, error };
}
