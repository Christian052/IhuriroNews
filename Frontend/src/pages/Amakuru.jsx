import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../component/Header'
import Footer from '../component/Footer'

const Amakuru = () => {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('https://ihurironews.onrender.com/api/news')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data)
      })
      .catch((err) => console.error('Error fetching articles:', err))
  }, [])

  const announcements = [
    {
      title: "Indirimbo z'iki gihembwe",
      content: "Hitamo indirimbo nshya z'iki gihembwe",
      icon: "🎵"
    },
    {
      title: "Amakinamico",
      content: "Amakinamico y'iki gihembwe mu rwego rwo kwibuka Jenoside",
      icon: "🎭"
    },
    {
      title: "Amajonjora",
      content: "Amajonjora y'abanyamakuru ku ngingo zitandukanye",
      icon: "🎤"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">Amakuru</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main articles column */}
          <div className="lg:col-span-2 space-y-6">
            {articles.map((article) => (
              <Link
                to={`/amakuru/${article._id}`}
                key={article._id}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {article.image && (
                    <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {article.category || 'Andi Makuru'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p
                      className="text-gray-600 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Twamamaza</h2>

              <div className="space-y-4">
                <div className="bg-black text-green-400 p-6 rounded-lg text-center hover:bg-gray-900 transition-colors duration-200 cursor-pointer">
                  <div className="text-3xl font-bold mb-2">Muzika</div>
                  <div className="text-2xl font-bold">Abahanzi</div>
                  <div className="text-green-400 text-4xl mt-2">▶</div>
                </div>

                {announcements.map((item, index) => (
                  <div key={index} className="flex items-start p-3 bg-white rounded-lg shadow-xs hover:bg-gray-50">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.content}</p>
                    </div>
                  </div>
                ))}

                <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop"
                    alt="Concert"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Amakuru
