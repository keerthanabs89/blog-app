import axios from 'axios';

// ✅ This defines your live Backend URL
const BASE_URL = 'https://blog-app-8jo3.onrender.com';

// 1. Function to GET all blogs
export const getBlogs = async () => {
  // Uses the live Render URL
  const response = await axios.get(`${BASE_URL}/blogs`);
  return response.data;
};

// 2. Function to GET a SINGLE blog by ID
export const getBlogById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/blogs/${id}`);
  return response.data;
};

// 3. Function to CREATE a new blog
export const createBlog = async (newBlog: any) => {
  const response = await fetch(`${BASE_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBlog),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create blog');
  }
  
  return response.json();
};