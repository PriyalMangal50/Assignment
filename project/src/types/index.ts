// User Types
export interface User {
  _id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  role?: 'admin' | 'user';
}

// Blog Types
export interface Comment {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  description: string;
  mediaUrl?: string; // Cloudinary URL
  author: User;
  likes: string[]; // Array of user IDs
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  totalPages: number;
  currentPage: number;
  totalBlogs: number;
}

// API Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface BlogRequest {
  title: string;
  description: string;
  mediaUrl?: string;
}

export interface CommentRequest {
  content: string;
}

// Component Props
export interface BlogItemProps {
  blog: Blog;
  onLike: (blogId: string) => void;
  onComment: (blogId: string, comment: string) => void;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blogId: string) => void;
  showActions?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}