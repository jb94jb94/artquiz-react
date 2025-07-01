import { useState } from "react";
import { useArtists } from "./hooks/useArtists";
import { ImageQuiz } from './components/ImageQuiz';
import { LikedImages } from "./components/LikedImages";
import { ArtistList } from "./components/ArtistList";
import type { Artist } from "./hooks/useArtists";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function HomePage() {
  const { artists } = useArtists();
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(artists);

  return (
    <div>
      <h1 className="logo">Kunst-Quiz</h1>
      <ArtistList artists={artists} setFilteredArtists={setFilteredArtists} />
      <ImageQuiz artists={filteredArtists} />
    </div>
  );
}

function LikedImagesPage() {
  return (
    <div>
      <h1>Gelikete Bilder</h1>
      <LikedImages/>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/liked" element={<LikedImagesPage />} />
      </Routes>
    </Router>
  );
}

export default App;