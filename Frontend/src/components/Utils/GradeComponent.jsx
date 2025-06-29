import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

// Import the user context to access user data and update functions
const GradeContext = createContext();
// Create a context for grade management
export const useGrade = () => useContext(GradeContext);
// Custom hook to access grade context
// This hook allows components to easily access and update the grade state
export const GradeProvider = ({ children }) => {
  const { user, update } = useUser();
  const [grade, setGradeState] = useState(1); // Default grade is 1
  // State to hold the current grade

  // When user logs in, initialize grade from user
  useEffect(() => {
    if (user?.grade != null) {
      setGradeState(user.grade);
    }
  }, [user]);
/**
 * Set the user's grade.
 * @param {number} newGrade - The new grade to set.
 */
  const setGrade = async (newGrade) => {
    setGradeState(newGrade);
    // Update the grade state and also update the user in the database
    if (user) {
      try {
        // Update the user's grade in the database
        await update(user.email, { grade: newGrade }); 
        localStorage.removeItem('advice'); // Clear cached advice when grade changes
        console.log(user.grade);
      } catch (err) {
        console.error('Failed to update user grade:', err);
      }
    }
  };

  return (
    <GradeContext.Provider value={{ grade, setGrade }}>
      {children}
    </GradeContext.Provider>
  );
};
export default GradeProvider;