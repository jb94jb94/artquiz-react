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
    const src = `https://illustrious-concha-fe7ba3.netlify.app/${randomArtist.folder}/${number}.jpg`;
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

      {Object.entries(scores).length > 0 && (
        <div className="stats-panel">
          <h3>Deine Statistik</h3>
          <ul>
            {Object.entries(scores)
              .sort((a, b) => b[1].correct - a[1].correct)
              .map(([artist, { correct, wrong }]) => (
                <li key={artist}>
                  <strong>{artist}</strong>: ✅ {correct} | ❌ {wrong}
                </li>
              ))}
          </ul>
        </div>
      )}

      <Link id="back-button" to="/liked">Zu den gelikten Bildern</Link>
    </div>
  );
}
