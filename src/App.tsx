import { useState } from "react";
import { useArtists } from "./hooks/useArtists";
import Navbar from "./components/Navbar";
import { ImageQuiz } from './components/ImageQuiz';
import LikedImagesPage from "./pages/LikedImagesPage";
import { ArtistList } from "./components/ArtistList";
import type { Artist } from "./hooks/useArtists";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";
import { AuthForm } from "./components/AuthForm";
import StatsPage from "./pages/StatsPage";

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

function App() {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/liked" element={<LikedImagesPage />} />
        <Route path="/stats" element={<StatsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
