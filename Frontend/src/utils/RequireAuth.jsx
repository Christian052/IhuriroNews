// src/utils/RequireAuth.js
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 10800; // in seconds

    // Token expired
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
    return true;
  } catch {
    // Invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
