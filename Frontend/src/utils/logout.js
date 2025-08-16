// src/utils/logout.js
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };
};
