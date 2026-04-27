import React from 'react';

// API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const fetchBlogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Cache blogs data
let blogsCache = null;
let blogsPromise = null;

export const getBlogs = async () => {
  if (blogsCache) {
    return blogsCache;
  }
  
  if (!blogsPromise) {
    blogsPromise = fetchBlogs();
  }
  
  try {
    blogsCache = await blogsPromise;
    return blogsCache;
  } finally {
    blogsPromise = null;
  }
};

// Legacy export for backward compatibility
export const blogs = [];

// Dynamic import function that fetches from API
export const useBlogs = () => {
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBlogs();
  }, []);
  
  return { blogs, loading };
};

export const getFeaturedBlog = async () => {
  const blogs = await getBlogs();
  return blogs[0];
};

export const getRecentBlogs = async () => {
  const blogs = await getBlogs();
  return blogs.slice(1);
};

export const getBlogById = async (id) => {
  const blogs = await getBlogs();
  return blogs.find(blog => blog.id === id);
};
