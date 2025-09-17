import axios from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  SignupRequest, 
  BlogsResponse, 
  Blog, 
  BlogRequest,
  CommentRequest,
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
  
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/user/signup', data);
    return response.data;
  },
};

// Blog API
export const blogAPI = {
  getBlogs: async (search = '', page = 1, limit = 10): Promise<BlogsResponse> => {
    const response = await api.get(`/api/blog?search=${search}&page=${page}&limit=${limit}`);
    return response.data;
  },
  
  createBlog: async (data: BlogRequest): Promise<Blog> => {
    const response = await api.post('/api/blog', data);
    return response.data;
  },
  
  updateBlog: async (id: string, data: BlogRequest): Promise<Blog> => {
    const response = await api.put(`/api/blog/${id}`, data);
    return response.data;
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

// Media API
export const mediaAPI = {
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('media', file); // must match backend field name
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/admin/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },
};