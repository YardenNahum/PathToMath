const express = require('express');
const apiRoute = express.Router();
//use googlegen ai
const { GoogleGenAI } = require('@google/genai');
//get api key from process
const ai = new GoogleGenAI({ apiKey:  process.env.GEMINI_API_KEY });
//post request to gemini to generate question using prompt
apiRoute.post('/generate-question', async (req, res) => {
  const { prompt } = req.body;
  //validate the prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    //request to generate content using gemini
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    //return question if successful
    const question = result?.text?.trim();
    res.json({ question });
    //if there was an error return error
  } catch (error) {
    console.error("Error generating question:", error); 
    res.status(500).json({ error: 'Error generating question' });
  }
});

module.exports = apiRoute;
