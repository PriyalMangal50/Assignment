import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/SearchBar';
import { BlogList } from '../components/BlogList';
import { Pagination } from '../components/Pagination';
import { blogAPI, adminAPI, mediaAPI } from '../api';
import { Blog, BlogsResponse, User } from '../types';
import { Plus, Users, X, Upload } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blogs' | 'users'>('blogs');
  
  // Blog state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // User state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Modal state
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState<any>({
    title: '',
    description: '',
    mediaUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBlogs = async (searchQuery = '', page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const response: BlogsResponse = await blogAPI.getBlogs(searchQuery, page, 10);
      setBlogs(response.blogs);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err: any) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    setError('');
    
    try {
      const response = await adminAPI.getUsers();
      setUsers(response);
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogs();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBlogs(search, 1);
  };

  // Only allow like/comment for non-admin users
  const canInteract = !(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '{}').role === 'admin');

  const handlePageChange = (page: number) => {
    fetchBlogs(search, page);
  };

  const handleLike = async (blogId: string) => {
    try {
      await blogAPI.likeBlog(blogId);
      fetchBlogs(search, currentPage);
    } catch (err: any) {
      console.error('Failed to like blog:', err);
    }
  };

  const handleComment = async (blogId: string, comment: string) => {
    try {
      await blogAPI.addComment(blogId, { content: comment });
      fetchBlogs(search, currentPage);
    } catch (err: any) {
      console.error('Failed to add comment:', err);
    }
  };

  const openBlogModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title,
        description: blog.description,
        mediaUrl: (blog as any).mediaUrl || ''
      });
    } else {
      setEditingBlog(null);
  setBlogForm({ title: '', description: '', mediaUrl: '' });
    }
    setShowBlogModal(true);
  };

  const closeBlogModal = () => {
    setShowBlogModal(false);
  setEditingBlog(null);
  setBlogForm({ title: '', description: '', mediaUrl: '' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await mediaAPI.uploadMedia(file);
  setBlogForm((prev: any) => ({ ...prev, mediaUrl: response.url }));
    } catch (err: any) {
      setError('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Force token refresh for admin
    const user = localStorage.getItem('user');
    if (user && JSON.parse(user).role !== 'admin') {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    try {
      if (editingBlog) {
        await blogAPI.updateBlog(editingBlog._id, blogForm);
        setSuccess('Blog updated successfully');
      } else {
        await blogAPI.createBlog(blogForm);
        setSuccess('Blog created successfully');
      }
      closeBlogModal();
      fetchBlogs(search, currentPage);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        (editingBlog ? 'Failed to update blog' : 'Failed to create blog')
      );
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    // Force token refresh for admin
    const user = localStorage.getItem('user');
    if (user && JSON.parse(user).role !== 'admin') {
      setError('You must be logged in as admin to perform this action.');
      return;
    }

    try {
      await blogAPI.deleteBlog(blogId);
      setSuccess('Blog deleted successfully');
      fetchBlogs(search, currentPage);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to delete blog');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      setError('Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      setSuccess('User role updated successfully');
      fetchUsers();
    } catch (err: any) {
      setError('Failed to update user role');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('blogs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blogs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Blog Management
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <SearchBar 
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
              />
              <button
                onClick={() => openBlogModal()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>New Blog</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading blogs...</p>
              </div>
            ) : (
              <>
                <BlogList 
                  blogs={blogs}
                  onLike={canInteract ? handleLike : () => {}}
                  onComment={canInteract ? handleComment : () => {}}
                  onEdit={openBlogModal}
                  onDelete={handleDeleteBlog}
                  showActions={true}
                />
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value as 'admin' | 'user')}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Blog Modal */}
        {showBlogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h3>
                <button
                  onClick={closeBlogModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleBlogSubmit} className="p-6 space-y-4">
                <div className="mb-2 text-xs text-gray-500">
                  Supported: images (jpg, jpeg, png, gif), videos (mp4, webm), or direct media URLs (YouTube, image/video links)
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm((prev: any) => ({ ...prev, title: e.target.value }))}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={blogForm.description}
                    onChange={(e) => setBlogForm((prev: any) => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Media</label>
                  <div className="mt-1 flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <label
                        htmlFor="media-upload"
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <Upload size={16} />
                        <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                      </label>
                      {blogForm.mediaUrl && blogForm.mediaUrl.startsWith('http') && (
                        <span className="text-sm text-green-600">Media uploaded or URL set</span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Or paste an image/video URL here"
                      value={blogForm.mediaUrl}
                      onChange={e => setBlogForm((prev: any) => ({ ...prev, mediaUrl: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {blogForm.mediaUrl && (
                    <div className="mt-2">
                      {blogForm.mediaUrl.includes('video') || blogForm.mediaUrl.match(/\.mp4|\.webm|youtube|youtu\.be/) ? (
                        <video controls className="w-full h-32 object-cover rounded">
                          <source src={blogForm.mediaUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <img 
                          src={blogForm.mediaUrl} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeBlogModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingBlog ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};