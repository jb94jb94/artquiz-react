import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const USER_ID = "00000000-0000-0000-0000-000000000000"; // Demo-ID, später dynamisch

export function useLikedArtworks() {
  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLikes() {
      const { data, error } = await supabase
        .from("user_data")
        .select("likedArtworks")
        .eq("user_id", USER_ID)
        .single();

      if (error && error.code === "PGRST116") {
        // Kein Datensatz? Anlegen
        await supabase.from("user_data").insert({ user_id: USER_ID, likedArtworks: [] });
        setLikedArtworks([]);
      } else if (data) {
        setLikedArtworks(data.likedArtworks || []);
      }
      setLoading(false);
    }
    fetchLikes();
  }, []);

  async function toggleLike(imageId: string) {
    let updatedLikes;
    if (likedArtworks.includes(imageId)) {
      updatedLikes = likedArtworks.filter((id) => id !== imageId);
    } else {
      updatedLikes = [...likedArtworks, imageId];
    }
    setLikedArtworks(updatedLikes);

    await supabase.from("user_data").upsert({
      user_id: USER_ID,
      likedArtworks: updatedLikes,
      updated_at: new Date().toISOString(),
    });
  }

  return { likedArtworks, toggleLike, loading };
}