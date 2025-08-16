import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import Footer from '../component/Footer'
import { Link } from 'react-router-dom'

const Ubukungu = () => {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('https://ihurironews.onrender.com/api/news')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (item) => item.category?.toLowerCase() === 'ubukungu'
        )
        setArticles(filtered)
      })
      .catch((err) => console.error('Error fetching articles:', err))
  }, [])

  const marketData = [
    { name: "USD/RWF", value: "1,350", change: "+0.2%", isPositive: true },
    { name: "EUR/RWF", value: "1,420", change: "-0.1%", isPositive: false },
    { name: "RSE Index", value: "158.7", change: "+1.2%", isPositive: true },
    { name: "Gold", value: "2,015", change: "+0.8%", isPositive: true }
  ]

  const featuredArticle = articles[0]
  const businessArticles = articles.slice(1, 6)

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ubukungu</h1>
          <div className="text-sm text-gray-500">
            Amakuru y'ubukungu n'ubucuruzi
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Featured */}
            {featuredArticle && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                <Link to={`/amakuru/${featuredArticle._id}`}>
                  <div className="relative">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {featuredArticle.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                      {featuredArticle.title}
                    </h2>
                    <p
                      className="text-gray-600 mb-4 text-lg leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: featuredArticle.content }}
                    ></p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{new Date(featuredArticle.updatedAt).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>{featuredArticle.category}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Recent Articles */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Amakuru y'ubukungu aheruka</h2>
              <div className="space-y-6">
                {businessArticles.map((article) => (
                  <Link to={`/amakuru/${article._id}`} key={article._id}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        <div className="w-48 h-32 flex-shrink-0 relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-center mb-2">
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="ml-auto text-xs text-gray-500">
                              {new Date(article.updatedAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Amasoko</h3>
              <div className="space-y-3">
                {marketData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                      <p
                        className={`text-xs ${
                          item.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Ibikorwa bya LEO</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>📈 Inama y'abafatanyabikorwa - 14:00</p>
                <p>💼 Guhagurukirana kw'ubucuruzi - 16:00</p>
                <p>📊 Raporo y'isoko - 18:00</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ibikugera</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium text-gray-900">Ubusanzwe</p>
                  <p className="text-xs text-gray-600">Kwa Mbere - Kwa Gatanu: 8:00-17:00</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm font-medium text-green-900">Amasoko</p>
                  <p className="text-xs text-gray-600">24/7 kumurongo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Ubukungu
