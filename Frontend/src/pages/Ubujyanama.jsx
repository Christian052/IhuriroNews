import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { Link } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage'; // ✅ import spinner

const Ubujyanama = () => {
  const [activeTab, setActiveTab] = useState('Iyobokamana');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const categoriesToDisplay = ['Iyobokamana', 'Ubuzima', 'Urukundo'];

  useEffect(() => {
    fetch('https://ihurironews.onrender.com/api/news')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) =>
          categoriesToDisplay.includes(item.category)
        );
        setArticles(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setArticles([]);
        setError(true);
        setLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter((item) => item.category === activeTab);

  // ✅ Show full-screen loading while fetching
  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-center space-x-4 mb-8">
          {categoriesToDisplay.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {error ? (
          <p className="text-center text-red-500">Failed to load articles.</p>
        ) : filteredArticles.length === 0 ? (
          <p className="text-center text-gray-500">Ntamakuru aboneka kuri iyi category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((card) => (
              <Link
                key={card._id}
                to={`/amakuru/${card._id}`}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{card.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(card.updatedAt).toLocaleDateString('rw-RW', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Ubujyanama;
