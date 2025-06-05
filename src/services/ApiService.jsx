import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const URL = `${BASE_URL}/api/`;

const generateQuestionsAI = async (prompt) => {
  try {
    const response = await axios.post(`${URL}generate-question`, { prompt });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  generateQuestionsAI
};
