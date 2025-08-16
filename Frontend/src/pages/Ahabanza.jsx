import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";

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

  return (
    <>
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-medium text-gray-700 mb-2">
                Amakuru agenzeho:
              </p>
              {loadingNews ? (
                <p className="text-sm text-gray-500">Turimo kubikurangira...</p>
              ) : errorNews ? (
                <p className="text-sm text-red-600">{errorNews}</p>
              ) : news.length === 0 ? (
                <p className="text-sm text-gray-500">Nta makuru abonetse.</p>
              ) : (
                <Link
                  to={`/amakuru/${news[0]._id}`}
                  className="block cursor-pointer"
                  aria-label={`Soma inkuru: ${news[0].title}`}
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                          {news[0].title}
                        </h1>
                        <div
                          className="text-gray-600 line-clamp-4 prose"
                          dangerouslySetInnerHTML={{ __html: news[0].content }}
                        ></div>
                      </div>
                      <div className="md:w-80 h-48 md:h-auto">
                        <img
                          src={
                            news[0].image?.startsWith("http")
                              ? news[0].image
                              : news[0].image
                              ? `https://ihurironews.onrender.com/uploads/${news[0].image}`
                              : "https://via.placeholder.com/400x300?text=No+Image"
                          }
                          alt={news[0].title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>

            {/* All other news */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Amakuru yose:
              </h2>
              {loadingNews ? (
                <p className="text-sm text-gray-500">Turimo kubikurangira...</p>
              ) : errorNews ? (
                <p className="text-sm text-red-600">{errorNews}</p>
              ) : news.length <= 1 ? (
                <p className="text-sm text-gray-500">Nta makuru yandi abonetse.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {news.slice(1).map((item, index) => (
                    <Link
                      key={item._id}
                      to={`/amakuru/${item._id}`}
                      className="block cursor-pointer"
                      aria-label={`Soma inkuru: ${item.title}`}
                    >
                      <Card
                        title={item.title}
                        time={new Date(item.updatedAt).toLocaleString("rw-RW")}
                        image={item.image}
                        delay={index * 0.1}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ✅ Videos Section with responsive grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ibihangano</h2>

              {loadingVideos ? (
                <p className="text-sm text-gray-500">Turimo kubikurangira...</p>
              ) : errorVideos ? (
                <p className="text-sm text-red-600">{errorVideos}</p>
              ) : videos.length === 0 ? (
                <p className="text-sm text-gray-500">Nta videwo zabonetse.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside>
            <motion.div
              className="bg-gray-100 rounded-lg p-4 sticky top-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Twamamaza
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={sportsImage}
                  alt="Twamamaza"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Ad+Image";
                  }}
                />
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ahabanza;
