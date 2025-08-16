 
import axios from "axios";

const BASE_URL = "https://ihurironews.onrender.com"; // Change if backend is hosted elsewhere

export const fetchArticles = () => axios.get(`${BASE_URL}/api/news`);
export const fetchUsers = () => axios.get(`${BASE_URL}/api/users`);
export const fetchComments = () => axios.get(`${BASE_URL}/api/comments`);
export const getCategories = () => axios.get(`${API_BASE}/categories`);
export const createCategory = (data) => axios.post(`${API_BASE}/categories`, data);
export const updateCategory = (id, data) => axios.put(`${API_BASE}/categories/${id}`, data);
export const deleteCategory = (id) => axios.delete(`${API_BASE}/categories/${id}`);
