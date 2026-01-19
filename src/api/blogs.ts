import axios from 'axios';

// 1. Function to GET all blogs
export const getBlogs = async () => {
  const response = await axios.get('http://localhost:3001/blogs');
  return response.data;
};

// 2. Function to GET a SINGLE blog by ID (New!)
export const getBlogById = async (id: string) => {
  const response = await axios.get(`http://localhost:3001/blogs/${id}`);
  return response.data;
};

// 3. Function to CREATE a new blog
export const createBlog = async (newBlog: any) => {
  const response = await fetch('http://localhost:3001/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBlog),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create blog');
  }
  
  return response.json();
};