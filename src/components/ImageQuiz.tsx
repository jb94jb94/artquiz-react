import { useState, useEffect } from "react";
import type { Artist } from "../hooks/useArtists";
import './ImageQuiz.css';
import { useUserData } from "../hooks/useUserData";
import { Link } from "react-router-dom";

type ImageData = {
  src: string;
  artist: string;
  imageId: string;
};

type Props = {
  artists: Artist[];
};

export function ImageQuiz({ artists }: Props) {
  const { likedArtworks, toggleLike, updateScore, scores } = useUserData();
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [answerGiven, setAnswerGiven] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [guessed, setGuessed] = useState<string | null>(null);

  const [showStats, setShowStats] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'correct' | 'wrong' | 'percent'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (artists.length > 0) {
      loadRandomImage();
    } else {
      setCurrentImage(null);
    }
  }, [artists]);

  function loadRandomImage() {
    if (artists.length === 0) return;

    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const number = Math.floor(Math.random() * randomArtist.count) + 1;
    const src = `https://flourishing-sfogliatella-525af4.netlify.app/${randomArtist.folder}/${number}.jpg`;
    const imageId = `${randomArtist.name}-${number}`;
    setCurrentImage({ src, artist: randomArtist.name, imageId });

    const others = artists
      .map((a) => a.name)
      .filter((name) => name !== randomArtist.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [...others, randomArtist.name].sort((a, b) =>
      a.localeCompare(b)
    );

    setOptions(allOptions);
    setAnswerGiven(false);
    setGuessed(null);
  }

  function guess(name: string) {
    if (!answerGiven && currentImage) {
      const isCorrect = name === currentImage.artist;
      setGuessed(name);
      setAnswerGiven(true);
      updateScore(currentImage.artist, isCorrect);
    }
  }

  function toggleSort(key: 'name' | 'correct' | 'wrong' | 'percent') {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  }

  const sortedStats = Object.entries(scores || {}).map(([name, { correct = 0, wrong = 0 }]) => {
    const percent = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    return { name, correct, wrong, percent };
  }).sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    if (a[sortBy] < b[sortBy]) return -1 * dir;
    if (a[sortBy] > b[sortBy]) return 1 * dir;
    return 0;
  });

  const buttons = options.map((name) => {
    const isCorrect = name === currentImage?.artist;
    const isGuessed = name === guessed;

    let className = '';
    if (answerGiven) {
      if (isCorrect) className = 'correct';
      else if (isGuessed && !isCorrect) className = 'wrong';
    }

    return (
      <button
        key={name}
        onClick={(e) => {
          e.stopPropagation();
          guess(name);
        }}
        disabled={answerGiven}
        className={className}
      >
        {name}
      </button>
    );
  });

  function LikeButton({
    liked,
    onClick,
  }: {
    liked: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }) {
    return (
      <button
        onClick={onClick}
        aria-pressed={liked}
        title={liked ? "Gefällt mir entfernt" : "Gefällt mir"}
        className={`like-button ${liked ? "liked" : ""}`}
      >
        {liked ? "❤️" : "🤍"}
      </button>
    );
  }

  const likeButton =
    currentImage ? (
      <LikeButton
        liked={likedArtworks.includes(currentImage.imageId)}
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(currentImage.imageId);
        }}
      />
    ) : null;

  return (
    <div
      onClick={() => answerGiven && loadRandomImage()}
      style={{ cursor: answerGiven ? 'pointer' : 'default' }}
    >
      <div className="quiz-container">
        {currentImage ? (
          <>
            <img
              src={currentImage.src}
              alt="Artwork"
              className="quiz-image"
              onClick={() => answerGiven && loadRandomImage()}
            />
            {likeButton}
          </>
        ) : (
          <div className="text-center p-4 text-red-500">
            Keine Künstler passen zur aktuellen Filterkombination.
          </div>
        )}
      </div>

      {currentImage && <div className="answer-buttons">{buttons}</div>}

      <Link id="back-button" to="/liked">Zu den gelikten Bildern</Link>

      {Object.keys(scores).length > 0 && (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowStats((prev) => !prev);
            }}
            className="toggle-stats-button"
          >
            {showStats ? 'Statistik ausblenden' : 'Statistik anzeigen'}
          </button>

          {showStats && (
            <div className="stats-table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th onClick={() => toggleSort('name')}>Name</th>
                    <th onClick={() => toggleSort('correct')}>Richtig</th>
                    <th onClick={() => toggleSort('wrong')}>Falsch</th>
                    <th onClick={() => toggleSort('percent')}>Trefferquote</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map(({ name, correct, wrong, percent }) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{correct}</td>
                      <td>{wrong}</td>
                      <td>{percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
