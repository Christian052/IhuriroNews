import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import { toast, ToastContainer } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { XCircle } from "lucide-react";
import "react-quill/dist/quill.snow.css";

const API_BASE = "https://ihurironews.onrender.com/api/news";
const API_CATEGORIES = "https://ihurironews.onrender.com/categories";
const baseUrl = "https://ihurironews.onrender.com"; // <-- base URL for images

export default function NewsFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const quillRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing) fetchPost();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_CATEGORIES);
      setCategories(res.data.map((cat) => cat.name));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${id}`);
      const post = res.data;

      setTitle(post.title || "");
      setAuthor(post.author || "");
      setCategory(post.category || "");
      setStatus(post.status || "draft");
      setContent(post.content || "");

      if (post.image) {
        const isFullUrl =
          post.image.startsWith("http://") || post.image.startsWith("https://");
        setExistingImageUrl(
          isFullUrl ? post.image : `${baseUrl}/uploads/Images/${post.image}`
        );
      } else {
        setExistingImageUrl(null);
      }
    } catch (error) {
      toast.error("Failed to load post data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setExistingImageUrl(null); // clear existing image preview if new file chosen

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const inputClass =
    "w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500";

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("status", status);
      formData.append("content", content);
      formData.append("updatedAt", new Date().toISOString());
      if (!isEditing) formData.append("createdAt", new Date().toISOString());
      if (imageFile) formData.append("image", imageFile);

      if (isEditing) {
        await axios.put(`${API_BASE}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Post updated successfully");
      } else {
        await axios.post(API_BASE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Post created successfully");
      }
      navigate("/admin/articles");
    } catch (error) {
      toast.error("Failed to save post");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 w-full mx-auto">
          <div className="relative mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
            <button
              onClick={() => navigate("/admin/articles")}
              className="absolute top-0 right-0 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-1"
              disabled={submitting}
              aria-disabled={submitting}
            >
              <XCircle size={24} />
              Back
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
              Loading post...
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!submitting) handleSave();
              }}
              className="bg-white dark:bg-gray-800 rounded p-6 shadow space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-1 text-gray-700 dark:text-gray-300"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    className={inputClass}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="author"
                    className="block mb-1 text-gray-700 dark:text-gray-300"
                  >
                    Author
                  </label>
                  <input
                    id="author"
                    type="text"
                    className={inputClass}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-1 text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className={inputClass}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block mb-1 text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    className={inputClass}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="content-editor"
                  className="block mb-1 text-gray-700 dark:text-gray-300"
                >
                  Content <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  readOnly={submitting}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }],
                      ["blockquote", "code-block"],
                      [{ color: [] }, { background: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "align",
                    "blockquote",
                    "code-block",
                    "color",
                    "background",
                    "link",
                    "image",
                  ]}
                  placeholder="Start writing your news post..."
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block mb-1 text-gray-700 dark:text-gray-300"
                >
                  {isEditing ? "Update Image" : "Upload Image"}
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
                {(imagePreview || existingImageUrl) && (
                  <img
                    src={imagePreview || existingImageUrl}
                    alt="Preview"
                    className="mt-3 max-h-48 rounded border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/articles")}
                  disabled={submitting}
                  className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Post"
                    : "Save Post"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
