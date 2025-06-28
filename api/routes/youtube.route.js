const express = require('express');
const youtubeRoute = express.Router();
const fetch = require('node-fetch');

youtubeRoute.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = youtubeRoute;