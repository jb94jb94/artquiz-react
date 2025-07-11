import { useState, useEffect } from "react";
import { useUserData } from "../hooks/useUserData";
import { useArtists } from "../hooks/useArtists";
import "./LikedImages.css";
import { Link } from "react-router-dom";

export function LikedImages() {
  const { likedArtworks, toggleLike, loading: loadingLikes } = useUserData();
  const { artists, loading: loadingArtists, error } = useArtists();

  const [likedByArtist, setLikedByArtist] = useState<Record<string, { src: string; imageId: string }[]>>({});
  const [modalData, setModalData] = useState<{ src: string; imageId: string } | null>(null);

  // Sobald likedArtworks oder artists sich ändern, gruppiere liked artworks nach Künstler
  useEffect(() => {
    console.log("Liked Artworks:", likedArtworks);
    console.log("Artists:", artists);
    if (loadingArtists) return; // Warte auf Künstlerdaten

    const grouped: Record<string, { src: string; imageId: string }[]> = {};

    likedArtworks.forEach((imageId) => {
      const [artistName, numberStr] = imageId.split("-");
      const artist = artists.find((a) => a.name === artistName);
      if (!artist) return;
      const src = `flourishing-sfogliatella-525af4.netlify.app/${artist.folder}/${numberStr}.jpg`;

      if (!grouped[artistName]) grouped[artistName] = [];
      grouped[artistName].push({ src, imageId });
    });

    setLikedByArtist(grouped);
  }, [likedArtworks, artists, loadingArtists]);

  function openModal(data: { src: string; imageId: string }) {
    setModalData(data);
  }

  function closeModal() {
    setModalData(null);
  }

  function handleToggleLike() {
    if (!modalData) return;
    toggleLike(modalData.imageId);
    // Optional: Modal schließen, wenn gerade entfernt
    if (likedArtworks.includes(modalData.imageId)) closeModal();
  }

  if (loadingLikes || loadingArtists) return <p>Lädt...</p>;
  if (error) return <p>Fehler beim Laden der Künstlerdaten: {error}</p>;

  if (Object.keys(likedByArtist).length === 0) {
    return <p>Du hast noch keine Bilder geliked.</p>;
  }

  return (
    <>
      <Link id="back-button" to="/">← Zurück zum Quiz</Link>
      <h1>Gelikte Kunstwerke</h1>

      <div id="gallery-container">
        {Object.keys(likedByArtist)
          .sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" }))
          .map((artist) => (
            <div key={artist} className="artist-group">
              <h2>{artist}</h2>
              <div className="artist-images">
                {likedByArtist[artist].map(({ src, imageId }) => (
                  <div key={imageId} className="liked-image" onClick={() => openModal({ src, imageId })}>
                    <img src={src} alt={`Kunstwerk von ${artist}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      <div
        id="image-modal"
        className={modalData ? "visible" : ""}
        aria-hidden={modalData ? "false" : "true"}
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        {modalData && (
          <>
            <img src={modalData.src} alt="Großes Kunstwerk" />
            <button
              id="modal-like-button"
              aria-pressed={likedArtworks.includes(modalData.imageId) ? "true" : "false"}
              aria-label="Gefällt mir"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleLike();
              }}
            >
              {likedArtworks.includes(modalData.imageId) ? "❤️" : "🤍"}
            </button>
          </>
        )}
      </div>
    </>
  );
}
