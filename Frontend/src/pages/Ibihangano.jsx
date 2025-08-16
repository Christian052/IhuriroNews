import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import axios from 'axios';

const Ibihangano = () => {
  const YOUTUBE_API_KEY = 'AIzaSyBb1SF6KjxnFM6jca7szY17tHHhdJqjnzQ';

  const [dbVideos, setDbVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchDbVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/music');
        setDbVideos(response.data);
      } catch (error) {
        console.error('Error fetching music from DB:', error);
        setError('Ntibishobotse kubona indirimbo.');
      }
    };
    fetchDbVideos();
  }, []);

  const fetchChannelDate = async (channelId) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${YOUTUBE_API_KEY}&part=snippet`
      );
      const channel = res.data.items?.[0];
      return channel?.snippet?.publishedAt || null;
    } catch (error) {
      console.error('YouTube Channel API error:', error);
      return null;
    }
  };

  useEffect(() => {
    if (dbVideos.length === 0) {
      setVideos([]);
      setLoading(false);
      return;
    }

    const fetchVideoData = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          dbVideos.map(async (item) => {
            const id = getYouTubeId(item.youtubeUrl);
            if (!id) return null;

            const res = await axios.get(
              `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
            );
            const video = res.data.items?.[0];
            if (!video?.snippet) return null;

            const channelCreatedDate = await fetchChannelDate(video.snippet.channelId);

            return {
              id,
              url: item.youtubeUrl,
              title: video.snippet.title,
              artist: video.snippet.channelTitle,
              views: `${Number(video.statistics.viewCount).toLocaleString()} views`,
              thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
              channelCreatedDate,
            };
          })
        );

        setVideos(results.filter(Boolean));
      } catch (err) {
        console.error('YouTube API error:', err);
        setError('Ntibishobotse kubona amakuru ya YouTube.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [dbVideos]);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Muzika</h1>

        {loading ? (
          <div className="text-center py-10 text-gray-700 font-medium text-lg">
            Loading videos...
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-600">No videos available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="nofollow noreferrer noopener"
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-200"
              >
                <div className="aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-700">{video.artist}</p>
                  <p className="text-sm text-gray-500">{video.views}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Ibihangano;
