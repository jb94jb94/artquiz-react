import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const USER_ID = "00000000-0000-0000-0000-000000000000"; // Demo-ID, später dynamisch

type Scores = {
  [artistName: string]:{correct: number; wrong: number};
}
export function useUserData() {
  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);
  const [scores,setScores]= useState<Scores>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const { data, error } = await supabase
        .from("user_data")
        .select("likedArtworks,scores")
        .eq("user_id", USER_ID)
        .single();

      if (error && error.code === "PGRST116") {
        // Kein Datensatz? Anlegen
        await supabase.from("user_data").insert({ user_id: USER_ID, likedArtworks: [],scores: {} });
        setLikedArtworks([]);
        setScores({});
      } else if (data) {
        setLikedArtworks(data.likedArtworks || []);
        setScores(data.scores||{});
      }
      setLoading(false);
    }
    fetchUserData();
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

 async function updateScore(artist: string, correct: boolean) {
    const current = scores[artist] || { correct: 0, wrong: 0 };
    const updated = {
      ...scores,
      [artist]: {
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
      },
    };

    setScores(updated);
    await supabase.from('user_data').upsert({
      user_id: USER_ID,
      scores: updated,
    });
  }

 return { likedArtworks, toggleLike, loading, scores, updateScore };
}