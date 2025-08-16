import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AdminSidebar from "../../components/admin/AdminSidebar"
import { Trash2, PlusCircle } from 'lucide-react'

const YOUTUBE_API_KEY = 'AIzaSyBb1SF6KjxnFM6jca7szY17tHHhdJqjnzQ' // replace with your real key

const AdminIbihangano = () => {
  const [links, setLinks] = useState([])
  const [videoData, setVideoData] = useState({})
  const [newLink, setNewLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return match ? match[1] : null
  }

  const fetchLinks = async () => {
    setFetching(true)
    setError(null)
    try {
      const res = await axios.get('https://ihurironews.onrender.com/api/music')
      if (Array.isArray(res.data)) {
        setLinks(res.data)
        // Fetch video metadata
        const metadataPromises = res.data.map(async (item) => {
          const videoId = extractVideoId(item.youtubeUrl)
          if (!videoId) return null

          try {
            const videoRes = await axios.get(
              `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
            )
            const info = videoRes.data.items[0]?.snippet
            return {
              id: item._id,
              title: info?.title || 'Unknown Title',
              artist: info?.channelTitle || 'Unknown Artist',
            }
          } catch (err) {
            return {
              id: item._id,
              title: 'Error loading title',
              artist: 'Error loading artist',
            }
          }
        })

        const results = await Promise.all(metadataPromises)
        const metadata = {}
        results.forEach((data) => {
          if (data) metadata[data.id] = data
        })
        setVideoData(metadata)
      } else {
        setError('Unexpected response format from server')
        setLinks([])
      }
    } catch (err) {
      console.error('Error fetching links:', err)
      setError('Failed to fetch links from server')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleAddLink = async () => {
    if (!newLink.trim()) return
    setLoading(true)
    try {
      await axios.post('https://ihurironews.onrender.com/api/music', { youtubeUrl: newLink.trim() })
      setNewLink('')
      await fetchLinks()
    } catch (err) {
      alert('Failed to add link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return
    try {
      await axios.delete(`https://ihurironews.onrender.com/api/music/${id}`)
      setLinks((prev) => prev.filter((link) => link._id !== id))
    } catch (err) {
      alert('Failed to delete link. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Ibihangano</h1>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Add YouTube Link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            disabled={loading}
          />
          <button
            onClick={handleAddLink}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            <PlusCircle size={18} />
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        {fetching && <p className="text-gray-700 dark:text-gray-300">Loading links...</p>}
        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
        )}

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">YouTube Info</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((item, index) => {
                const meta = videoData[item._id] || {}
                return (
                  <tr key={item._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-800 dark:text-gray-200">{index + 1}</td>
                    <td className="p-3">
                      <div className="max-w-xs">
                        
                        <div className="mt-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                            {meta.title || 'Loading title...'}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {meta.artist || 'Loading artist...'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete link"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {links.length === 0 && !fetching && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminIbihangano
