import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  MessageSquare,
  Music,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useLogout } from "../../utils/logout";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adminMenuItems = useMemo(
    () => [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        end: true,
      },
      { title: "Articles", url: "/admin/articles", icon: FileText },
      { title: "Categories", url: "/admin/categories", icon: Tags },
      { title: "Users", url: "/admin/users", icon: Users },
      { title: "Music", url: "/admin/ibihangano", icon: Music },
      { title: "Feedback", url: "/admin/comments", icon: MessageSquare },
    ],
    []
  );

  const isActivePath = useCallback(
    (path, exact = false) =>
      exact ? location.pathname === path : location.pathname.startsWith(path),
    [location.pathname]
  );

  const logout = useLogout();

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay when mobile sidebar is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white dark:bg-gray-900 border-r dark:border-gray-700 text-gray-900 dark:text-gray-200
          h-screen fixed md:sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out z-50
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "left-0" : "-left-64"}
          md:left-0 md:block
        `}
        aria-label="Admin sidebar"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between py-4 px-4 border-b dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-800 dark:text-white select-none">
                Amakuru Admin
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded transition"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-2 px-1">
          {adminMenuItems.map(({ title, url, icon: Icon, end }) => (
            <NavLink
              key={title}
              to={url}
              end={end}
              onClick={() => window.innerWidth < 768 && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${
                  isActivePath(url, end)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
              aria-current={isActivePath(url, end) ? "page" : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">{title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="absolute bottom-16 left-0 w-full px-4 flex justify-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              p-2 rounded-full border border-gray-300 dark:border-gray-600
              bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              transition-colors duration-200 shadow-md flex justify-center
              ${
                collapsed
                  ? "scale-90 pointer-events-none opacity-0"
                  : "scale-100 opacity-100"
              }
            `}
            title="Toggle Dark Mode"
            aria-pressed={darkMode}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={logout}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
              text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50
              ${collapsed ? "justify-center" : "justify-start"}
            `}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3 select-none">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
