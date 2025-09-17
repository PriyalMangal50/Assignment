import React from 'react';
import { Blog } from '../types';
import { BlogItem } from './BlogItem';

interface BlogListProps {
  blogs: Blog[];
  onLike: (blogId: string) => void;
  onComment: (blogId: string, comment: string) => void;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blogId: string) => void;
  showActions?: boolean;
}

export const BlogList: React.FC<BlogListProps> = ({ 
  blogs, 
  onLike, 
  onComment, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No blogs found.</p>
      </div>
    );
  }

  return (
    <div>
      {blogs.map((blog) => (
        <BlogItem
          key={blog._id}
          blog={blog}
          onLike={onLike}
          onComment={onComment}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
};