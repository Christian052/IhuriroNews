import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { useParams, Link } from "react-router-dom";

const AmakuruReader = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`https://ihurironews.onrender.com/api/news/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Inkuru ntiboneka");
        return res.json();
      })
      .then((data) => setArticle(data))
      .catch((err) => {
        console.error("Error fetching article:", err);
        setArticle(null);
      });
  }, [id]);

  useEffect(() => {
    fetch("https://ihurironews.onrender.com/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Amakuru ntaboneka");
        return res.json();
      })
      .then((data) => setArticles(data))
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setArticles([]);
      });
  }, []);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Ntamakuru yabonetse
        </h2>
        <p className="text-gray-600 mb-4">
          Inkuru mwashakaga ntibonetse. Mwagerageza gusubira inyuma.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Subira ku rupapuro rw'ibanze
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full mx-auto px-5 py-8 font-sans gap-8 flex flex-col md:flex-row">
        <div className="md:w-3/4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {article.title}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            {new Date(article.updatedAt || article.date).toLocaleString("rw-RW", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {article.image && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={
                  article.image.startsWith("http")
                    ? article.image
                    : `https://ihurironews.onrender.com/uploads/${article.image}`
                }
                alt={article.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/800x500?text=Ifoto+ntiboneka";
                }}
                className="w-full object-cover max-h-96"
              />
            </div>
          )}

          {/* Render trusted HTML content */}
          <div
            className="prose prose-lg max-w-none mb-4 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <aside className="md:w-1/4 bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-0 z-10 h-fit overflow-y-auto max-h-[calc(100vh-4rem)]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Inkuru nyamukuru
          </h2>
          <div className="space-y-6">
            {articles.slice(0, 3).map((item) => (
              <Link
                to={`/amakuru/${item._id}`}
                key={`popular-${item._id}`}
                className="block group hover:bg-gray-100 p-3 rounded-lg transition"
                aria-label={`Soma inkuru: ${item.title}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `https://ihurironews.onrender.com/uploads/Images/${item.image}`
                      }
                      alt={`Ifoto y'inkuru ${item.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-balance text-gray-500 mt-1">
                      {new Date(item.updatedAt || item.date).toLocaleString("rw-RW", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default AmakuruReader;
