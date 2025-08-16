import React, { useState, useEffect } from "react";
import axios from "axios";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState("");
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/songs");
      setSongs(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch songs.");
    }
  };

  const addSong = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/songs", {
        url: newUrl.trim(),
      });
      setSongs([res.data, ...songs]);
      setNewUrl("");
      setError("");
      setCurrentIndex(0); // play newly added song immediately
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add song.");
    }
  };

  const playNext = () => {
    if (!songs.length) return;
    if (isShuffling) {
      setCurrentIndex(Math.floor(Math.random() * songs.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % songs.length);
    }
  };

  const playPrevious = () => {
    if (!songs.length) return;
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const selectSong = (index) => {
    setCurrentIndex(index);
  };

  const currentSong = songs[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Ibihangano Music Player</h1>

      {/* Add new YouTube song form */}
      <form onSubmit={addSong} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Paste YouTube video URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-grow border border-gray-300 rounded px-3 py-2"
          aria-label="YouTube video URL"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          aria-label="Add song"
        >
          Add
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Songs list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-auto">
        {songs.map((song, index) => (
          <div
            key={song._id}
            className={`p-3 rounded border cursor-pointer hover:bg-gray-100 ${
              index === currentIndex ? "bg-blue-100 border-blue-400" : "border-gray-300"
            }`}
            onClick={() => selectSong(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") selectSong(index);
            }}
            aria-pressed={index === currentIndex}
          >
            <p className="font-semibold truncate">{song.title}</p>
            <p className="text-sm text-gray-600 truncate">{song.artist}</p>
          </div>
        ))}
      </div>

      {/* Player iframe & controls */}
      {currentSong && (
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-semibold text-center">{currentSong.title}</h2>
          <div className="aspect-video rounded overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1&rel=0`}
              title={currentSong.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={playPrevious}
              aria-label="Previous song"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              ⏮ Previous
            </button>
            <button
              onClick={() => setIsLooping(!isLooping)}
              aria-pressed={isLooping}
              aria-label="Toggle loop"
              className={`px-4 py-2 rounded ${
                isLooping ? "bg-green-200" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              🔁 Loop
            </button>
            <button
              onClick={() => setIsShuffling(!isShuffling)}
              aria-pressed={isShuffling}
              aria-label="Toggle shuffle"
              className={`px-4 py-2 rounded ${
                isShuffling ? "bg-yellow-200" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              🔀 Shuffle
            </button>
            <button
              onClick={playNext}
              aria-label="Next song"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              ⏭ Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
