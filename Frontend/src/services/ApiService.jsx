import axios from 'axios';
import BASE_URL from '../components/Utils/Config_server';

const URL = `${BASE_URL}/api/`;

/**
 * Generates questions using AI based on the provided prompt.
 * @param {string} prompt - The prompt to generate questions from.
 * @returns {Promise<Object>} - The generated questions.
 */
const generateQuestionsAI = async (prompt) => {
  try {
    //send a POST request with the prompt
    const response = await axios.post(`${URL}generate-question`, { prompt });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches YouTube videos related to the query.
 * @param {string} query - The search string.
 * @returns {Promise<Object>} - The list of videos.
 */
const fetchYouTubeVideos = async (query) => {
  try {
    const response = await axios.get(`${URL}youtube/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  generateQuestionsAI,
  fetchYouTubeVideos
};
