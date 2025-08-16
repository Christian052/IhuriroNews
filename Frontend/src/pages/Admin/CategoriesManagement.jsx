import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, XCircle } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ihurironews.onrender.com/categories";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error("Failed to load categories");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing._id}`, formData);
        toast.success("Category updated");
      } else {
        await axios.post(API_URL, { ...formData, status: "Active" });
        toast.success("Category created");
      }
      setShowModal(false);
      setFormData({ name: "", description: "", status: "Active" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status || "Active",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await axios.delete(`${API_URL}/${categoryToDelete}`);
        toast.success("Category deleted");
        fetchCategories();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete category");
      }
      setCategoryToDelete(null);
      setShowDeleteConfirmModal(false);
    }
  };

  const toggleStatus = async (id) => {
    const category = categories.find((c) => c._id === id);
    if (!category) return;

    const updatedStatus = category.status === "Active" ? "Inactive" : "Active";

    try {
      await axios.put(`${API_URL}/${id}`, {
        ...category,
        status: updatedStatus,
      });
      toast.success("Status updated");
      fetchCategories();
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col p-4">
        {/* Top bar: search + add button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setFormData({ name: "", description: "", status: "Active" });
              setEditing(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Table wrapper with horizontal scroll on small screens */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/40"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.description}</td>
                    <td className="p-3">
                      <span
                        onClick={() => toggleStatus(category._id)}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          category.status === "Active"
                            ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-white"
                            : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-white"
                        }`}
                      >
                        {category.status || "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 w-full max-w-md rounded-lg relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editing ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                >
                  {editing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Delete Confirmation
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this category?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CategoriesManagement;
