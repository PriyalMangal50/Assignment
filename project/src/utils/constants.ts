export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/user/signup',
  
  // Blog
  BLOGS: '/api/blog',
  BLOG_LIKE: (id: string) => `/api/blog/${id}/like`,
  BLOG_COMMENT: (id: string) => `/api/blog/${id}/comment`,
  BLOG_DETAIL: (id: string) => `/api/blog/${id}`,
  
  // Media
  CLOUDINARY: '/api/cloudinary',
  
  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_USER: (id: string) => `/api/admin/users/${id}`,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
} as const;