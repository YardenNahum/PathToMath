// config.js
export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://path-to-math-ohap16tdm-yardennahums-projects.vercel.app'
    : 'http://localhost:5000';
export default BASE_URL;