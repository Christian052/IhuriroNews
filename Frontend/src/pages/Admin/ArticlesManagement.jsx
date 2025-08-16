import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast, ToastContainer } from 'react-toastify';

const API_BASE = 'http://localhost:5000/api/news';
const API_CATEGORIES = 'http://localhost:5000/categories';

export default function NewsListPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const statuses = ['All', 'published', 'draft'];
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setErrorLoading(false);
    try {
      const res = await axios.get(API_BASE);
      setPosts(res.data);
    } catch (e) {
      setErrorLoading(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_CATEGORIES);
      setCategories(['All', ...res.data.map((cat) => cat.name)]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories(['All']);
    }
  };

  const handleDeleteClick = (postId) => {
    setSelectedPostId(postId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${selectedPostId}`);
      toast.success('Post deleted');
      setPosts(posts.filter((p) => p._id !== selectedPostId));
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setShowDeleteConfirmModal(false);
      setSelectedPostId(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || post.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">News Editor</h1>
            <button
              onClick={() => navigate('/admin/news/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus size={18} /> New Post
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 mb-6">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Search articles..."
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              {statuses.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">Loading posts...</div>
          ) : errorLoading ? (
            <div className="text-center py-6 text-red-600 dark:text-red-400">
              Failed to load posts.
              <button
                onClick={fetchPosts}
                className="ml-4 bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 text-white"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">No</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Title</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Author</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Category</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Updated</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPosts.length ? (
                    filteredPosts.map((post, index) => (
                      <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 line-clamp-1 h-2">{post.title}</td>
                        <td className="px-6 py-4">{post.author}</td>
                        <td className="px-6 py-4">{post.category}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded border ${
                              post.status === 'published'
                                ? 'bg-green-100 text-green-700 border-green-700 dark:bg-green-800 dark:text-green-200 dark:border-green-400'
                                : 'bg-gray-100 text-gray-700 border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-400'
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(post.updatedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/news/${post._id}/edit`)}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                            aria-label="Edit Post"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post._id)}
                            className="text-red-600 hover:underline dark:text-red-400"
                            aria-label="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Delete Confirmation</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
