import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ihurironews.onrender.com/api/users";
const roles = ["Admin", "Editor", "Writer", "Contributor"];
const statuses = ["Active", "Inactive"];

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Writer",
    status: "Active",
    avatar: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const dataToSubmit = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      role: formData.role,
      status: formData.status,
      avatar: formData.avatar || null,
    };

    if (!editingUserId) {
      dataToSubmit.password_hash = formData.password;
    } else if (editingUserId && formData.password) {
      dataToSubmit.password_hash = formData.password;
    }

    try {
      if (editingUserId) {
        await axios.put(`${API_URL}/${editingUserId}`, dataToSubmit);
        toast.success("User updated successfully");
      } else {
        await axios.post(API_URL, dataToSubmit);
        toast.success("User added successfully");
      }
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "Writer",
        status: "Active",
        avatar: "",
      });
      setShowForm(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Save user error:", error.response?.data || error.message);
      toast.error("Failed to save user: " + (error.response?.data?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${confirmDeleteId}`);
      toast.success("User deleted successfully");
      setConfirmDeleteId(null);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <AdminSidebar />

      <main className="flex-1 p-4 flex flex-col">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setEditingUserId(null);
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  role: "Writer",
                  status: "Active",
                  avatar: "",
                });
                setShowForm(true);
              }}
              className={`flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded w-full sm:w-auto justify-center
                ${loading || saving ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={loading || saving}
              aria-label="Add User"
              title="Add User"
            >
              <Plus size={16} /> Add User
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              title="Toggle Dark Mode"
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 w-full max-w-md">
          <div className="relative">
            <Search
              className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search users"
            />
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="flex justify-center py-8" role="status" aria-live="polite">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          // Table container scrolls horizontally on small screens
          <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    No
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingUserId(user._id);
                            setFormData({
                              ...user,
                              password: "",
                              avatar: user.avatar || "",
                            });
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                          aria-label={`Edit user ${user.username}`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(user._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          aria-label={`Delete user ${user.username}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="userFormTitle"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-md space-y-4"
            >
              <h2 id="userFormTitle" className="text-xl font-semibold">
                {editingUserId ? "Edit User" : "Add User"}
              </h2>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-required="true"
                aria-label="Username"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-required="true"
                aria-label="Email"
              />
              {!editingUserId && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-required="true"
                  aria-label="Password"
                />
              )}
              {editingUserId && (
                <input
                  type="password"
                  placeholder="New Password (leave blank to keep current)"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="New Password"
                />
              )}
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Role"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Status"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-600 dark:text-gray-300"
                  aria-label="Cancel"
                >
                  <XCircle size={20} />
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 rounded text-white ${
                    saving
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="deleteDialogTitle"
            aria-describedby="deleteDialogDesc"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4 max-w-sm w-full">
              <h2
                id="deleteDialogTitle"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                Delete Confirmation
              </h2>
              <p
                id="deleteDialogDesc"
                className="text-gray-700 dark:text-gray-300"
              >
                Are you sure you want to delete this user?
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 py-1 border rounded dark:text-white w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
