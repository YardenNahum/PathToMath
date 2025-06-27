 import React from 'react';

 // Mapping of each math topic to the minimum grade level it is introduced
 const topicGrade = {
  "Addition": 1,
  "Subtraction": 1,
  "Multiplication": 3,
  "Division": 4,
  "Percentage": 5
};

/**
 * topicGrade is a dictionary that maps each math topic to the minimum grade level
 * at which it is introduced in the curriculum.
 * 
 * This mapping helps determine which topics are available based on the user's grade level.
 * 
 * Each key represents a math topic, and its value indicates the earliest grade where that topic is taught.
 */
export default topicGrade;
