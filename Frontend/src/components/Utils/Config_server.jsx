/**
 * Sets the base URL for API requests based on the environment.
 * If running in production, use the deployed Vercel URL.
 * Otherwise, default to the local development server.
 */
export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://path-to-math.vercel.app'
    : 'http://localhost:5000';

export default BASE_URL;