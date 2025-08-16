import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statuses = ["All", "Read", "Unread"];

export default function AdminMessages() {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedComment, setViewedComment] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);



  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/comments");
      setComments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = comments.filter((c) => {
    const searchMatch =
      c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      selectedStatus === "All" ||
      (selectedStatus === "Read" && c.read) ||
      (selectedStatus === "Unread" && !c.read);

    return searchMatch && statusMatch;
  });

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/comments/${id}/read`);
      fetchComments();
      toast.success("Marked as read.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentToDeleteId}`);
      fetchComments();
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  const getStatusBadge = (read) => {
    return read
      ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
      : "bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700";
  };

  return (
    <div className="h-screen flex w-full bg-gray-50 dark:bg-gray-900 font-inter">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <ToastContainer />
        <div className="space-y-6 p-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Messages</h1>
            
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">No messages found.</div>
            ) : (
              <table className="min-w-full text-sm text-gray-900 dark:text-gray-100">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <tr>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Message</th>
                    <th className="py-2 px-4">Phone</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.map((msg) => (
                    <tr key={msg._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 px-4">{msg.name}</td>
                      <td className="py-2 px-4">{msg.email}</td>
                      <td className="py-2 px-4 max-w-sm truncate">{msg.message}</td>
                      <td className="py-2 px-4">{msg.phone || "-"}</td>
                      <td className="py-2 px-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(msg.read)}`}>
                          {msg.read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex space-x-2">
                        <button
                          onClick={() => {
                            setViewedComment(msg);
                            setShowViewModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="View"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
                        {!msg.read && (
                          <button
                            onClick={() => handleMarkAsRead(msg._id)}
                            className="p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded text-green-600"
                            title="Mark as Read"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCommentToDeleteId(msg._id);
                            setShowDeleteConfirmModal(true);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* View Modal */}
          {showViewModal && viewedComment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 relative">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Message Details</h2>
                <p><strong>Name:</strong> {viewedComment.name}</p>
                <p><strong>Email:</strong> {viewedComment.email}</p>
                <p><strong>Phone:</strong> {viewedComment.phone || "-"}</p>
                <p><strong>Date:</strong> {new Date(viewedComment.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {viewedComment.read ? "Read" : "Unread"}</p>
                <p className="mt-4"><strong>Message:</strong></p>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-1">
                  {viewedComment.message}
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          {showDeleteConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6 relative">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Delete Confirmation</h2>
                <p>Are you sure you want to delete this message?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowDeleteConfirmModal(false)}
                    className="px-4 py-2 rounded border dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
