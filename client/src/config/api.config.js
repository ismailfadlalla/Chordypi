// Production API Configuration
const API_CONFIG = {
  // Python Flask Backend (Chord Analysis)
  PYTHON_API: process.env.REACT_APP_PYTHON_API_URL || 'https://chordypi-api.onrender.com',
  
  // Node.js Backend (Pi Network)
  NODE_API: process.env.REACT_APP_NODE_API_URL || 'https://chordypi.vercel.app',
  
  // API Endpoints
  endpoints: {
    // Python Flask endpoints
    analyzeSong: '/api/analyze-song',
    searchSongs: '/api/search-songs',
    songs: '/api/songs',
    library: '/api/library',
    
    // Node.js endpoints
    piAuthenticate: '/api/pi/authenticate',
    piPayment: '/api/pi/payment',
    youtubeSearch: '/api/youtube/search',
    featuredSongs: '/api/featured-songs',
    health: '/api/health',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint, usePythonBackend = false) => {
  const baseUrl = usePythonBackend ? API_CONFIG.PYTHON_API : API_CONFIG.NODE_API;
  return `${baseUrl}${endpoint}`;
};

// Python backend endpoints
export const getPythonApiUrl = (endpoint) => {
  return `${API_CONFIG.PYTHON_API}${endpoint}`;
};

// Node.js backend endpoints
export const getNodeApiUrl = (endpoint) => {
  return `${API_CONFIG.NODE_API}${endpoint}`;
};

export default API_CONFIG;
