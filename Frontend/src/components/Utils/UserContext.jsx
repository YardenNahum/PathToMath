import { createContext, useContext, useState, useEffect } from 'react';
import { getUserByMail, addUser, updateUser } from '../../services/UserService';
import { useLoginStatus } from './LoginStatusComponent';
import { use } from 'react';

const UserContext = createContext();

// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { login, logout } = useLoginStatus();
  // Load user from localStorage on initial render
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      loadUser(email);
    }
  }, []);

    // Sync login status when user changes
  useEffect(() => {
    if (user) {
      login();   
    } else {
      logout();  
    }
  }, [user, login, logout]);
  // Load user by email and set state
  const loadUser = async (email) => {
    try {
      const fetchedUser = await getUserByMail(email);
      setUser(fetchedUser);
      return fetchedUser;
    } catch (error) {
      console.error(' Failed to load user:', error);
      return null;
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      const newUser = await addUser(userData);
      setUser(newUser);
      localStorage.setItem('userEmail', newUser.email);
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Update user by email
  const update = async (email, updates) => {
    try {
      const updatedUser = await updateUser(email, updates);
      setUser(updatedUser);
      return updatedUser;

    } catch (error) {
      console.error('❌ Failed to update user:', error);
      throw error;
    }
  };

  // Logout user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
  };
//get user by email without setting state
const getUserByMailNoSet = async (email) => {
  try {
    return await getUserByMail(email);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error; // rethrow to handle in calling function
  }
};
//check if user exists by email
const checkIfUserExists = async (email) => {
  try {
    const user = await getUserByMail(email);
    return !!user; // returns true if user exists
  } catch (error) {
    // Optionally handle 404-only errors differently
    if (error.response && error.response.status === 404) {
      return false; // email not taken
    }
  }
};

  return (
    <UserContext.Provider value={{ user, setUser, loadUser,getUserByMailNoSet, register, update, logoutUser, checkIfUserExists }}>
      {children}
    </UserContext.Provider>
  );
};
