import axios from 'axios';
import BASE_URL from '../components/Utils/Config_server';

const URL = `${BASE_URL}/api/users`;
/**
 * Fetch all users from the API.
 * @returns {Promise<Array>} - A promise that resolves to an array of users.
 */
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
/**
 * Fetch a user by email from the API.
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the user object.
 */
// Get user by email
export const getUserByMail = async (email) => {
  try {
    const response = await axios.get(`${URL}/${encodeURIComponent(email)}`); // ✅ encode email
    return response.data;
  } catch (error) {
    throw error;
  }
};
/**
 * Add new user
 * @param {Object} user - The user object to add.
 * @returns {Promise<Object>} - A promise that resolves to the added user object.
 */
export const addUser = async (user) => {
  try {
    const response = await axios.post(`${URL}/register`, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};
/**
 * Update user by email
 * @param {string} email - The email of the user to update.
 * @param {Object} user - The updated user object.
 * @returns {Promise<Object>} - A promise that resolves to the updated user object.
 */
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
