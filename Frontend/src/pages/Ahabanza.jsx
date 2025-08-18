import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";

// ✅ Reusable Loading Page
const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Turimo kubikurangira...</p>
      </div>
    </div>
  );
};

const sportsImage =
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop";

// News Card component
const Card = ({ title, time, image, isSquare = false, delay = 0 }) => {
  const imageUrl = image?.startsWith("http")
    ? image
    : image
    ? `https://ihurironews.onrender.com/uploads/${image}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div className={isSquare ? "aspect-square" : "aspect-video"}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </motion.div>
  );
};

const Ahabanza = () => {
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [errorNews, setErrorNews] = useState("");
  const [errorVideos, setErrorVideos] = useState("");

  // Pagination state
  const [newsPage, setNewsPage] = useState(1);
  const [videosPage, setVideosPage] = useState(1);
  const newsPerPage = 6;
  const videosPerPage = 6;

  const YOUTUBE_API_KEY = "AIzaSyBb1SF6KjxnFM6jca7szY17tHHhdJqjnzQ";

  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("https://ihurironews.onrender.com/api/news");
        setNews(res.data);
      } catch (err) {
        setErrorNews("Ntibishobotse kubona amakuru.");
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchDbVideos = async () => {
      try {
        const response = await axios.get("https://ihurironews.onrender.com/api/music");
        const dbVideos = response.data;

        if (dbVideos.length === 0) {
          setVideos([]);
          setLoadingVideos(false);
          return;
        }

        const fetchVideoData = async () => {
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

                return {
                  id,
                  url: item.youtubeUrl,
                  title: video.snippet.title,
                  artist: video.snippet.channelTitle,
                  views: `${Number(video.statistics.viewCount).toLocaleString()} views`,
                  thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
                };
              })
            );
            setVideos(results.filter(Boolean));
          } catch (err) {
            console.error("YouTube API error:", err);
            setErrorVideos("Ntibishobotse kubona amakuru ya YouTube.");
          } finally {
            setLoadingVideos(false);
          }
        };
        fetchVideoData();
      } catch (error) {
        console.error("Error fetching music from DB:", error);
        setErrorVideos("Ntibishobotse kubona indirimbo.");
        setLoadingVideos(false);
      }
    };
    fetchDbVideos();
  }, []);

  // Pagination calculations
  const paginatedNews = news.slice(1).slice(
    (newsPage - 1) * newsPerPage,
    newsPage * newsPerPage
  );
  const totalNewsPages = Math.ceil((news.length - 1) / newsPerPage);

  const paginatedVideos = videos.slice(
    (videosPage - 1) * videosPerPage,
    videosPage * videosPerPage
  );
  const totalVideoPages = Math.ceil(videos.length / videosPerPage);

  // ✅ Show full screen loading until both finish
  if (loadingNews || loadingVideos) {
    return <LoadingPage />;
  }

  return (
    <>
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... your existing layout stays unchanged ... */}
      </div>
      <Footer />
    </>
  );
};

export default Ahabanza;
