import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

const API_URL = "http://localhost:5000/api/settings";
const USER_ID = "replace-this-with-user-id"; // Dynamic user ID from auth or localStorage

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    darkMode: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/${USER_ID}`);
      setSettings(res.data);
    } catch (err) {
      toast.error("Failed to load settings");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${USER_ID}`, settings);
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await axios.put(`${API_URL}/${USER_ID}/password`, {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${settings.darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <AdminHeader />
        <div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={settings.name}
              onChange={handleChange}
              className="p-2 border rounded dark:bg-gray-800"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={settings.email}
              onChange={handleChange}
              className="p-2 border rounded dark:bg-gray-800"
            />
            <label className="flex items-center space-x-2 col-span-2">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>Enable Dark Mode</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <hr className="my-8 border-gray-300 dark:border-gray-700" />

          <h3 className="text-xl font-semibold mb-4">Change Password</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="p-2 border rounded dark:bg-gray-800"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="p-2 border rounded dark:bg-gray-800"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="p-2 border rounded dark:bg-gray-800"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update Password
          </button>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Settings;
