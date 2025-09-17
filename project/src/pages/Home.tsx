import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/SearchBar';
import { BlogList } from '../components/BlogList';
import { Pagination } from '../components/Pagination';
import { blogAPI } from '../api';
import { Blog, BlogsResponse } from '../types';

export const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBlogs(search, 1);
  };

  const handlePageChange = (page: number) => {
    fetchBlogs(search, page);
  };

  const handleLike = async (blogId: string) => {
    try {
      await blogAPI.likeBlog(blogId);
      // Refresh the current page to get updated like counts
      fetchBlogs(search, currentPage);
    } catch (err: any) {
      console.error('Failed to like blog:', err);
    }
  };

  const handleComment = async (blogId: string, comment: string) => {
    try {
      await blogAPI.addComment(blogId, { content: comment });
      // Refresh the current page to get updated comments
      fetchBlogs(search, currentPage);
    } catch (err: any) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Blog Feed</h1>
          <SearchBar 
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        ) : (
          <>
            <BlogList 
              blogs={blogs}
              onLike={handleLike}
              onComment={handleComment}
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
    </div>
  );
};