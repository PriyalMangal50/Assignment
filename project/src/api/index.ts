import axios from 'axios';
import {
  AuthResponse, LoginRequest, SignupRequest,
  BlogsResponse, Blog, BlogRequest, CommentRequest, User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://assignment-2-t8n7.onrender.com';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const res = await api.post('/api/user/signup', data);
    return res.data;
  },
};

// Blogs
export const blogAPI = {
  getBlogs: async (search = '', page = 1, limit = 10): Promise<BlogsResponse> => {
    const res = await api.get(`/api/blog?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
    return res.data;
  },
  createBlog: async (data: BlogRequest): Promise<Blog> => {
    const res = await api.post('/api/blog', data);
    return res.data;
  },
  updateBlog: async (id: string, data: BlogRequest): Promise<Blog> => {
    const res = await api.put(`/api/blog/${id}`, data);
    return res.data;
  },
  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/api/blog/${id}`);
  },
  likeBlog: async (id: string): Promise<void> => {
    await api.post(`/api/blog/${id}/like`);
  },
  addComment: async (id: string, data: CommentRequest): Promise<void> => {
    await api.post(`/api/blog/${id}/comment`, data);
  },
};

// Media (local)
export const mediaAPI = {
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('media', file);
    const res = await api.post('/api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },
};

// Admin
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const res = await api.get('/api/admin/users');
    return res.data;
  },
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await api.put(`/api/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },
};
