const express = require('express');
const youtubeRoute = express.Router();
const fetch = require('node-fetch');

/**
 * GET /search
 * Searches YouTube videos by a query string.
 * 
 * @param {string} query - The search query string (from query parameters).
 * @returns {Object} JSON response containing YouTube search results.
 * @throws 400 if query parameter is missing.
 * @throws 500 if fetching from YouTube API fails.
 */
youtubeRoute.get('/search', async (req, res) => {
  const { query } = req.query;

  // If 'query' is missing, return a 400 Bad Request error
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  // Construct the YouTube Data API URL using the provided query
  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=10`;

  try {
    const response = await fetch(url);      // Send a request to the YouTube API
    const data = await response.json(); // Parse the response as JSON
    res.json(data); // Send the data back to the client
  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = youtubeRoute;