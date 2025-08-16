import React from "react";
import { BarChart3, TrendingUp, Eye, Calendar } from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

const analyticsData = {
  overview: [
    { label: "Total Page Views", value: "124,567", change: "+12.5%", positive: true },
    { label: "Unique Visitors", value: "23,456", change: "+8.2%", positive: true },
    { label: "Avg. Session Duration", value: "4m 32s", change: "+15.3%", positive: true },
    { label: "Bounce Rate", value: "42.3%", change: "-5.1%", positive: false },
  ],
  topArticles: [
    { title: "Ubwiyunge bw'ubukungu mu Rwanda", views: 12456, category: "Ubukungu" },
    { title: "Amakuru y'ubuzima mu muryango", views: 9876, category: "Ubuzima" },
    { title: "Ibihangano by'abahanzi b'u Rwanda", views: 8765, category: "Ibihangano" },
    { title: "Iyobokamana n'ubuzima bwiza", views: 7654, category: "Iyobokamana" },
    { title: "Urukundo n'ubusabane", views: 6543, category: "Urukundo" },
  ],
  categories: [
    { name: "Iyobokamana", articles: 67, views: 45678, percentage: 35 },
    { name: "Ubukungu", articles: 45, views: 32145, percentage: 25 },
    { name: "Ubuzima", articles: 32, views: 23456, percentage: 18 },
    { name: "Ibihangano", articles: 28, views: 15678, percentage: 12 },
    { name: "Urukundo", articles: 19, views: 12789, percentage: 10 },
  ],
  recentActivity: [
    { action: "New article published", details: "Ubwiyunge bw'ubukungu", time: "2 hours ago" },
    { action: "User registered", details: "marie.claire@email.com", time: "4 hours ago" },
    { action: "Comment posted", details: "On 'Amakuru y'ubuzima'", time: "6 hours ago" },
    { action: "Article edited", details: "Ibihangano by'abahanzi", time: "8 hours ago" },
    { action: "Category created", details: "Siporo", time: "1 day ago" },
  ],
};

export default function AnalyticsDashboard() {
  return (
    <div className="h-screen flex w-full bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />

      {/* Main content area, now with vertical scrolling */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader />
        <main className="space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your website performance and content metrics
              </p>
            </div>
            <select
              className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              aria-label="Select date range"
            >
              <option value="30days">Last 30 days</option>
              <option value="7days">Last 7 days</option>
              <option value="90days">Last 3 months</option>
              <option value="year">This year</option>
            </select>
          </div>

          {/* Overview Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.overview.map((stat, i) => (
              <article
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded shadow"
                role="region"
                aria-labelledby={`overview-stat-${i}`}
              >
                <header className="flex justify-between items-center mb-1">
                  <p id={`overview-stat-${i}`} className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <Eye className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                </header>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp
                    className={`h-4 w-4 mr-1 ${
                      stat.positive ? "text-green-600" : "text-red-600"
                    }`}
                    aria-hidden="true"
                  />
                  <span className={stat.positive ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </article>
            ))}
          </section>

          {/* Top Articles + Categories */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Articles */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4" aria-label="Top Performing Articles">
              <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                <BarChart3 className="w-5 h-5 mr-2" aria-hidden="true" />
                Top Performing Articles
              </h2>
              {analyticsData.topArticles.map((article, i) => (
                <article
                  key={i}
                  className="flex justify-between items-start p-3 border rounded border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{article.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{article.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {article.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                  </div>
                </article>
              ))}
            </section>

            {/* Category Performance */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4" aria-label="Category Performance">
              <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                <BarChart3 className="w-5 h-5 mr-2" aria-hidden="true" />
                Category Performance
              </h2>
              {analyticsData.categories.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span>{cat.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {cat.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{cat.articles} articles</span>
                    <span>{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </section>
          </section>

          {/* Traffic Chart + Recent Activity */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placeholder Chart */}
            <section
              className="bg-white dark:bg-gray-800 p-6 rounded shadow"
              aria-label="Traffic Overview"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Traffic Overview
              </h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-300">
                <BarChart3 className="h-12 w-12 mb-2" aria-hidden="true" />
                <p>Traffic chart would go here</p>
                <p className="text-sm">Connect analytics service for real data</p>
              </div>
            </section>

            {/* Recent Activity */}
            <section
              className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4"
              aria-label="Recent Activity"
            >
              <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
                Recent Activity
              </h2>
              {analyticsData.recentActivity.map((act, i) => (
                <article
                  key={i}
                  className="flex items-start space-x-3 border border-gray-200 dark:border-gray-700 p-3 rounded"
                >
                  <span
                    className="w-2 h-2 bg-blue-600 rounded-full mt-2"
                    aria-hidden="true"
                  ></span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {act.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {act.details}
                    </p>
                  </div>
                  <time
                    className="text-xs text-gray-400 dark:text-gray-500"
                    dateTime={act.time}
                  >
                    {act.time}
                  </time>
                </article>
              ))}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}