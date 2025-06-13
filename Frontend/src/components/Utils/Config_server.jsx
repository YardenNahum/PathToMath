// config.js
export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://path-to-math.vercel.app/'
    : 'http://localhost:5000';
export default BASE_URL;