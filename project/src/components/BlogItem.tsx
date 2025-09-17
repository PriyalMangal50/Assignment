import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Edit, Trash2 } from 'lucide-react';
import { BlogItemProps } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const BlogItem: React.FC<BlogItemProps> = ({ 
  blog, 
  onLike, 
  onComment, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const { user } = useAuth();
  const isUser = user?.role === 'user';
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const isLiked = user && blog.likes.includes(user._id);
  const isAuthor = user && blog.author && user._id === blog.author?._id;

  const handleShare = () => {
    const url = `${window.location.origin}/blog/${blog._id}`;
    navigator.clipboard.writeText(url);
    alert('Blog URL copied to clipboard!');
  };

  const handleComment = () => {
    if (comment.trim()) {
      onComment(blog._id, comment);
      setComment('');
      setShowCommentForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-600">
              By {blog.author?.username ? blog.author.username : 'Unknown'} • {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {showActions && (isAuthor || user?.role === 'admin') && (
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(blog)}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                >
                  <Edit size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(blog._id)}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-4">{blog.description}</p>

        {blog.mediaUrl && (
          <div className="mb-4">
            {blog.mediaUrl.includes('video') ? (
              <video controls className="w-full max-h-96 rounded-lg">
                <source src={blog.mediaUrl} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={blog.mediaUrl} 
                alt="Blog media" 
                className="w-full max-h-96 object-cover rounded-lg"
              />
            )}
          </div>
        )}

        {showActions && isUser && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onLike(blog._id)}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{blog.likes.length}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle size={20} />
                <span>{blog.comments.length}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add Comment
            </button>
          </div>
        )}

  {showCommentForm && isUser && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {showComments && blog.comments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
            <div className="space-y-3">
              {blog.comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.author.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};