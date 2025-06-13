import axios from 'axios';
import BASE_URL from '../components/Utils/Config_server';

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
