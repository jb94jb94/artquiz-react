import { useState, useEffect } from "react";
import type { Artist } from "../hooks/useArtists";
import "./ArtistList.css";

interface Props {
    artists: Artist[];
    setFilteredArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
}

export function ArtistList({artists,setFilteredArtists}: Props){

const [selectedStyles,setSelectedStyles] = useState<string[]>([]);
const [relThreshold,setRelThreshold] = useState(0);
const [open, setOpen] = useState(true);

const historicalOrder = [
  "Pre-Renaissance",
  "Early Renaissance",
  "High Renaissance",
  "Late Renaissance",
  "Northern Renaissance",
  "Baroque",
  "Rococo",
  "Neoclassicism",
  "Romanticism",
  "Realism",
  "Impressionism",
  "Post-Impressionism",
  "Symbolism",
  "Art Nouveau",
  "Expressionism",
  "Cubism",
  "Surrealism",
  "Abstractionism",
  "Pop Art",
  "Conceptual",
  "Contemporary"
];

  const allStyles = [...new Set(artists.map((a) => a.style))].sort(
  (a, b) => historicalOrder.indexOf(a) - historicalOrder.indexOf(b));

useEffect(()=> {
  const filtered = artists.filter(
      (artist) =>
        artist.relevance >= relThreshold &&
        (selectedStyles.length === 0 || selectedStyles.includes(artist.style))
    );
    setFilteredArtists(filtered);
  }, [artists, relThreshold, selectedStyles, setFilteredArtists]);

function toggleStyle(style: string){
    if (selectedStyles.includes(style)){
        setSelectedStyles(selectedStyles.filter((s) => s!==style));
    } else {
        setSelectedStyles([...selectedStyles,style]);
    }
}

  return (
    <div className="artist-filter-wrapper">
      <button onClick={() => setOpen(!open)} className="toggle-button">
        {open ? "Filter ausblenden" : "Filter anzeigen"}
      </button>

      {open && (
        <div className="filter-box">
          <div>
            <h2 className="filter-heading">Filter nach Stil</h2>
            <div className="style-grid">
              {allStyles.map((style) => (
                <label key={style}>
                  <input
                    type="checkbox"
                    checked={selectedStyles.includes(style)}
                    onChange={() => toggleStyle(style)}
                  />
                  {style}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="relevance-label">
              Filter nach Relevanz: min {relThreshold} /10
              <input
                type="range"
                min="0"
                max="10"
                value={relThreshold}
                onChange={(e) => setRelThreshold(Number(e.target.value))}
                className="relevance-slider"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}