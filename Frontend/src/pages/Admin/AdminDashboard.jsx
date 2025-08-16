import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  Calendar,
  Search,
} from "lucide-react";
import { fetchArticles, fetchUsers, fetchComments } from "../../services/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchArticles()
      .then((res) => setArticles(res.data))
      .catch((e) => console.error("Error fetching articles:", e));
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch((e) => console.error("Error fetching users:", e));
    fetchComments()
      .then((res) => setComments(res.data))
      .catch((e) => console.error("Error fetching comments:", e));
  }, []);

  const stats = [
    {
      title: "Total Articles",
      value: articles.length,
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: users.length,
      change: "+5%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Comments",
      value: comments.length,
      change: "+23%",
      icon: MessageSquare,
      color: "text-yellow-600",
    },
    {
      title: "Page Views",
      value: "N/A",
      change: "+8%",
      icon: Eye,
      color: "text-blue-600",
    },
  ];

  const recentArticles = articles.slice(0, 5);

  return (
    <div className="min-h-screen flex w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Welcome back! Here's what's happening with Amakuru.
              </p>
              
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Articles */}
            <section className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-white">
                  Recent Articles
                </h2>
              </div>

              {recentArticles.slice(0, 3).map((article) => (
                <div
                  key={article._id}
                  className="flex justify-between items-start border p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                >
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 space-x-2">
                      <span>{article.category}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        article.status === "Published"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {article.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {article.views || 0} views
                    </p>
                  </div>
                </div>
              ))}
              <Link to="/admin/articles">
                <button className="w-full mt-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  View All Articles
                </button>
              </Link>
            </section>

            {/* Quick Actions */}
            <section className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>

              <Link to="/admin/news/new">
                <button
                  className="w-full flex items-center px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                 hover:bg-gray-100 dark:hover:bg-gray-800  duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="Create New Article"
                >
                  <FileText className="mr-3 h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Create New Article
                  </span>
                </button>
              </Link>

              <Link to="/admin/users">
                <button
                  className="w-full flex items-center px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-shadow duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="Manage Users"
                >
                  <Users className="mr-3 h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Manage Users
                  </span>
                </button>
              </Link>

              <Link to="/admin/comments">
                <button
                  className="w-full flex items-center px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                 hover:bg-gray-100 dark:hover:bg-gray-800  transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="Review Comments"
                >
                  <MessageSquare className="mr-3 h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Review Comments
                  </span>
                </button>
              </Link>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
