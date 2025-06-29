import React from 'react';

// Word problem templates for each subject
// Each subject has positive and negative templates
export const questions = {
  addition: {
    positive: "In the enchanted forest, Leo the wizard found ${var1} glowing mushrooms and his owl brought him ${var2} more. How many glowing mushrooms does Leo have now?",
    negative: "Leo had ${var1} glowing mushrooms, but a greedy troll took ${var2}. How many does he have left?"
  },
  subtraction: {
    positive: "Princess Elara had ${var1} magic crystals and gave ${var2} to a wandering fairy. How many does she have left?",
    negative: "Elara needs ${var2} magic crystals to lift the curse but only has ${var1}. How many more does she need?"
  },
  multiplication: {
    positive: "There are ${var1} treasure chests in the dragon's lair, and each holds ${var2} golden coins. How many coins are there in total?",
    negative: "A spell shattered ${var1} treasure chests, each with ${var2} coins. How many coins were lost?"
  },
  division: {
    positive: "You have ${var1} enchanted apples to share with ${var2} forest creatures. How many apples does each creature get?",
    negative: "The wizard needs to divide ${var1} spells into ${var2} scrolls. How many spells per scroll are missing?"
  },
  percentage: {
    positive: "${var2} out of ${var1} young wizards passed their flying exam. What percentage passed?",
    negative: "${var2} out of ${var1} potions turned sour. What percentage failed?"
  }
};
/**
 * Get a fallback question based on the subject and variables.
 * @param {string} subject - The subject of the question.
 * @param {number} var1 - The first variable to include in the question.
 * @param {number} var2 - The second variable to include in the question.
 * @param {number} answer - The answer to the question.
 * @returns {string} - The generated fallback question.
 */
const getFallbackQuestion = (subject, var1, var2, answer) => {
  const templates = questions[subject];
  if (!templates) return "No template found for subject.";
  // Determine if the answer is positive or negative based on its value
  const type = answer >= 0 ? "positive" : "negative";
  // Select the appropriate template based on the type
  const template = templates[type];
  return template.replace("${var1}", var1).replace("${var2}", var2);
};

/**
 * FallbackWordProblem
 * Displays a simple question if the AI fails to generate one.
 * 
 * @param {Object} props
 * @param {string} props.subject
 * @param {number} props.var1
 * @param {number} props.var2
 * @param {number} props.answer
 */
export const FallbackWordProblem = ({ subject, var1, var2, answer }) => {
  const question = getFallbackQuestion(subject, var1, var2, answer);
  return <div>{question}</div>;
};

export default { FallbackWordProblem };