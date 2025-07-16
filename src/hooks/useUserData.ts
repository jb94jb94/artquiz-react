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

export function useUserData() {
  const { user } = useAuth();

  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);
  const [stats, setStats] = useState<UserStatRow[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorLikes, setErrorLikes] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  // Likes laden
  useEffect(() => {
    if (!user) {
      setLikedArtworks([]);
      setLoadingLikes(false);
      return;
    }

    async function fetchLikes() {
      setLoadingLikes(true);
      setErrorLikes(null);

      const { data, error } = await supabase
        .from("user_data")
        .select("liked_artworks")
        .eq("user_id", user!.id)
        .single();

      if (error && error.code === "PGRST116") {
        // Kein Datensatz? Anlegen
        const { error: insertError } = await supabase.from("user_data").insert({
          user_id: user!.id,
          likedArtworks: [],
        });
        if (insertError) {
          setErrorLikes(insertError.message);
        } else {
          setLikedArtworks([]);
        }
      } else if (error) {
        setErrorLikes(error.message);
      } else if (data) {
        setLikedArtworks(data.liked_artworks || []);
      }
      setLoadingLikes(false);
    }

    fetchLikes();
  }, [user]);

  // Stats laden
  useEffect(() => {
    if (!user) {
      setStats([]);
      setLoadingStats(false);
      return;
    }

    async function fetchStats() {
      setLoadingStats(true);
      setErrorStats(null);

      const { data, error } = await supabase.rpc("get_detailed_user_stats", {
        uid: user!.id,
      });

      if (error) {
        setErrorStats(error.message);
        setStats([]);
      } else {
        setStats(data || []);
      }
      setLoadingStats(false);
    }

    fetchStats();
  }, [user]);

  // Likes togglen
  async function toggleLike(imageId: string) {
    if (!user) return;

    const updatedLikes = likedArtworks.includes(imageId)
      ? likedArtworks.filter((id) => id !== imageId)
      : [...likedArtworks, imageId];

    setLikedArtworks(updatedLikes);

    const { error } = await supabase.from("user_data").upsert({
      user_id: user.id,
      likedArtworks: updatedLikes,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (error) {
      setErrorLikes(error.message);
    }
  }

  // Score updaten
  async function updateScore(shownArtist: string, guessedArtist: string) {
    if (!user) return;

    const isCorrect = shownArtist === guessedArtist;

    const { error } = await supabase.from("guess_logs").insert({
      user_id: user.id,
      shown_artist: shownArtist,
      guessed_artist: guessedArtist,
      is_correct: isCorrect,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Fehler beim Speichern der Wertung:", error.message);
    }
  }

  return {
    likedArtworks,
    toggleLike,
    loadingLikes,
    errorLikes,
    stats,
    loadingStats,
    errorStats,
    updateScore,
  };
}
