import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const URL = `${BASE_URL}/api/users`;

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by email
export const getUserByMail = async (email) => {
  try {
    const response = await axios.get(`${URL}/${encodeURIComponent(email)}`); // ✅ encode email
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add new user
export const addUser = async (user) => {
  try {
    const response = await axios.post(`${URL}/register`, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update user by email
export const updateUser = async (email, user) => {
  try {
    const response = await axios.put(`${URL}/update/${encodeURIComponent(email)}`, user); 
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export default {
  getUsers,
  getUserByMail,
  addUser,
  updateUser
};
