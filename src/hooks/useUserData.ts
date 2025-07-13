import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const USER_ID = "00000000-0000-0000-0000-000000000000"; // Demo-ID, später dynamisch

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

export function useUserData() {
  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const { data, error } = await supabase
        .from("user_data")
        .select("likedArtworks")
        .eq("user_id", USER_ID)
        .single();

      if (error && error.code === "PGRST116") {
        // Kein Datensatz vorhanden – neuen User anlegen
        await supabase.from("user_data").insert({
          user_id: USER_ID,
          likedArtworks: [],
        });
        setLikedArtworks([]);
      } else if (data) {
        setLikedArtworks(data.likedArtworks || []);
      }

      setLoading(false);
    }

    fetchUserData();
  }, []);

  async function toggleLike(imageId: string) {
    const updatedLikes = likedArtworks.includes(imageId)
      ? likedArtworks.filter((id) => id !== imageId)
      : [...likedArtworks, imageId];

    setLikedArtworks(updatedLikes);

    await supabase.from("user_data").upsert({
      user_id: USER_ID,
      likedArtworks: updatedLikes,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Speichert jede Antwort als Eintrag in guess_logs
   */
  async function updateScore(shownArtist: string, guessedArtist: string) {
    const isCorrect = shownArtist === guessedArtist;

    await supabase.from("guess_logs").insert({
      user_id: USER_ID,
      shown_artist: shownArtist,
      guessed_artist: guessedArtist,
      is_correct: isCorrect,
      created_at: new Date().toISOString(),
    });
  }

  return {
    likedArtworks,
    toggleLike,
    loading,
    updateScore,
  };
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.rpc("get_detailed_user_stats", {
        uid: USER_ID,
      });

      if (error) {
        console.error("Fehler beim Laden der Statistiken:", error);
      } else {
        console.log(data)
        setStats(data);
      }

      setLoading(false);
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
