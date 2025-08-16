import React, { useEffect, useState } from "react";
import axios from "axios";
import { Music, Play, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MusicDashboard = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/songs");
      setSongs(res.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  const recentSongs = songs.slice(0, 3);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="w-6 h-6" /> Music Dashboard
        </h1>

        <Link to="/music-player">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Play className="w-4 h-4" /> Open Player
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-4 shadow text-center">
          <p className="text-gray-500">Total Songs</p>
          <h2 className="text-2xl font-bold">{songs.length}</h2>
        </div>

        <div className="bg-white border rounded p-4 shadow text-center">
          <p className="text-gray-500">Recently Added</p>
          <h2 className="text-2xl font-bold">{recentSongs.length}</h2>
        </div>

        <Link to="/music-player">
          <div className="bg-blue-100 border border-blue-300 rounded p-4 shadow hover:bg-blue-200 text-center cursor-pointer">
            <p className="text-blue-800 font-medium flex justify-center items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Song
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Songs */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Songs</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recentSongs.map((song) => (
            <div
              key={song._id}
              className="border rounded p-3 bg-white shadow-sm"
            >
              <p className="font-semibold">{song.title}</p>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicDashboard;
