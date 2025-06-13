const express = require('express');
const apiRoute = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create Gemini client with API key
const ai = new GoogleGenerativeAI("AIzaSyDHStM2VXxEakUGCuA2E9IgHDZ9XqvxM74");

// POST request to Gemini to generate a question from a prompt
apiRoute.post('/generate-question', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' }); // or 'gemini-1.5-flash'
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    res.json({ question: text });

  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: 'Error generating question' });
  }
});

module.exports = apiRoute;
