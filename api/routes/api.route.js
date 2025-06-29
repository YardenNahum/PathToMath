const express = require('express');
const apiRoute = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create Gemini client with API key
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST request to Gemini to generate a question from a prompt
 * @route POST /generate-question
 * @param {string} prompt - The prompt to generate a question from
 * @return {Object} - The generated question
 * @throws {400} - If the prompt is missing or not a string
 */
apiRoute.post('/generate-question', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    // Initialize the Gemini model
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // Generate content using the model
    // Using the model to generate a question based on the provided prompt
    const result = await model.generateContent(prompt);
    // Extract the response text from the result
    // The response contains the generated question based on the prompt
    const response = result.response;
    const text = response.text().trim();

    res.json({ question: text });

  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: 'Error generating question' });
  }
});
/**
 * POST request to Gemini to generate advice from a prompt
 * @route POST /generate-advice
 * @param {string} prompt - The prompt to generate advice from
 * @return {Object} - The generated advice
 * @throws {400} - If the prompt is missing or not a string
 * @throws {500} - If there is an error generating the advice
 */

apiRoute.post('/generate-advice', async (req, res) => {
  const { prompt } = req.body;
// Validate the prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    // Initialize the Gemini model
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // Generate content using the model
    // Using the model to generate a question based on the provided prompt
    const result = await model.generateContent(prompt);
    // Extract the response text from the result
    // The response contains the generated advice based on the prompt
    const response = result.response;
    const text = response.text().trim();

    res.json({ advice: text });

  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: 'Error generating advice' });
  }
});

module.exports = apiRoute;
