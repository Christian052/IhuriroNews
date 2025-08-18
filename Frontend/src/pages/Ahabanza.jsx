import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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

// ✅ News Card component
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

  // ✅ Fetch News
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

  // ✅ Fetch Videos from DB + YouTube API
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

        const results = await Promise.all(
          dbVideos.map(async (item) => {
            const id = getYouTubeId(item.youtubeUrl);
            if (!id) return null;

            try {
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
            } catch {
              return null;
            }
          })
        );

        setVideos(results.filter(Boolean));
      } catch (error) {
        setErrorVideos("Ntibishobotse kubona indirimbo.");
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchDbVideos();
  }, []);

  // ✅ Pagination calculations
  const paginatedNews = news.slice(
    (newsPage - 1) * newsPerPage,
    newsPage * newsPerPage
  );
  const totalNewsPages = Math.ceil(news.length / newsPerPage);

  const paginatedVideos = videos.slice(
    (videosPage - 1) * videosPerPage,
    videosPage * videosPerPage
  );
  const totalVideoPages = Math.ceil(videos.length / videosPerPage);

  // ✅ Show full screen loading until both finish
  if (loadingNews || loadingVideos) return <LoadingPage />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* ✅ News Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Amakuru Agezweho</h2>
          {errorNews ? (
            <p className="text-red-500">{errorNews}</p>
          ) : paginatedNews.length === 0 ? (
            <p className="text-gray-500">Nta makuru abonetse.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.map((item, i) => (
                <Link to={`/amakuru/${item._id}`} key={item._id}>
                  <Card
                    title={item.title}
                    time={new Date(item.createdAt).toLocaleDateString()}
                    image={item.image}
                    delay={i * 0.1}
                  />
                </Link>
              ))}
            </div>
          )}
          {/* ✅ Pagination */}
          {totalNewsPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(totalNewsPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setNewsPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    newsPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ✅ Videos Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Indirimbo Nshya</h2>
          {errorVideos ? (
            <p className="text-red-500">{errorVideos}</p>
          ) : paginatedVideos.length === 0 ? (
            <p className="text-gray-500">Nta ndirimbo zabonetse.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {paginatedVideos.map((video, i) => (
                  <motion.a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-200"
                  >
                    <div className="aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-700">{video.artist}</p>
                      <p className="text-sm text-gray-500">{video.views}</p>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </div>
          )}
          {/* ✅ Pagination */}
          {totalVideoPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(totalVideoPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVideosPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    videosPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Ahabanza;
