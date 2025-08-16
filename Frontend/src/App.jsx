import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./contexts/SearchContext";
import DarkModeProvider from "./contexts/DarkModeContext";

import Header from "./component/Header";
import Footer from "./component/Footer";

import Ahabanza from "./pages/Ahabanza";
import Ubukungu from "./pages/Ubukungu";
import Amakuru from "./pages/Amakuru";
import Ubujyanama from "./pages/Ubujyanama";
import Ibihangano from "./pages/Ibihangano";
import Aboturibo from "./pages/Aboturibo";
import Twandikire from "./pages/Twandikire";
import AmakuruReader from "./pages/AmakuruReader";
import MusicPlayer from "./pages/MusicPlayer";
import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import ArticlesManagement from "./pages/Admin/ArticlesManagement";
import CategoriesManagement from "./pages/Admin/CategoriesManagement";
import CommentsManagement from "./pages/Admin/CommentsManagement";
import UsersManagement from "./pages/Admin/UsersManagement";
import AddNewPost from "./pages/Admin/editor";
import NewsFormPage from "./pages/Admin/NewsFormPage";
import MusicDashoard from "./pages/Admin/MusicDashboard";
import AdminIbihangano from "./pages/Admin/AdminIbihangano";

import RequireAuth from "./utils/RequireAuth";

function App() {
  return (
    <DarkModeProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Ahabanza />} />
                <Route path="/ahabanza" element={<Ahabanza />} />
                <Route path="/ubukungu" element={<Ubukungu />} />
                <Route path="/amakuru" element={<Amakuru />} />
                <Route path="/amakuru/:id" element={<AmakuruReader />} />
                <Route path="/ubujyanama" element={<Ubujyanama />} />
                <Route path="/ibihangano" element={<Ibihangano />} />
                <Route path="/Aboturibo" element={<Aboturibo />} />
                <Route path="/twandikire" element={<Twandikire />} />
                <Route path="/music-player" element={<MusicPlayer />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={<RequireAuth><AdminDashboard /></RequireAuth>}
                />
                <Route
                  path="/admin/analytics"
                  element={<RequireAuth><AnalyticsDashboard /></RequireAuth>}
                />
                <Route
                  path="/admin/articles"
                  element={<RequireAuth><ArticlesManagement /></RequireAuth>}
                />
                <Route
                  path="/admin/categories"
                  element={<RequireAuth><CategoriesManagement /></RequireAuth>}
                />
                <Route
                  path="/admin/comments"
                  element={<RequireAuth><CommentsManagement /></RequireAuth>}
                />
                <Route
                  path="/admin/users"
                  element={<RequireAuth><UsersManagement /></RequireAuth>}
                />
                <Route
                  path="/admin/editor"
                  element={<RequireAuth><AddNewPost /></RequireAuth>}
                />
                <Route
                  path="/admin/news/new"
                  element={<RequireAuth><NewsFormPage /></RequireAuth>}
                />
                <Route
                  path="/admin/news/:id/edit"
                  element={<RequireAuth><NewsFormPage /></RequireAuth>}
                />
                <Route
                  path="/admin/music"
                  element={<RequireAuth><MusicDashoard /></RequireAuth>}
                />
                <Route
                  path="/admin/ibihangano"
                  element={<RequireAuth><AdminIbihangano /></RequireAuth>}
                />
              </Routes>
            </main>
          </div>
        </Router>
      </SearchProvider>
    </DarkModeProvider>
  );
}

export default App;
