// Use current window location to avoid CORS issues between localhost/127.0.0.1
const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // If running on Vercel (production), use the deployed backend
        if (hostname === 'chordypi.vercel.app') {
            return 'https://chordypi.onrender.com/api';
        }
        
        // If running locally, use local backend
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            const protocol = window.location.protocol;
            return `${protocol}//${hostname}:5000/api`;
        }
        
        // Default to production backend
        return 'https://chordypi.onrender.com/api';
    }
    // Fallback for server-side rendering (use production)
    return 'https://chordypi.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();
const CHORDS_API_ENDPOINT = `${API_BASE_URL}/analyze-song`;
const AUTH_API_ENDPOINT = `${API_BASE_URL}/auth`;
const HEALTH_CHECK_ENDPOINT = `${API_BASE_URL}/health`;

const DEFAULT_CHORDS = [
    { chord: 'C', time: 0, duration: 4, confidence: 0.8, beat: 1 },
    { chord: 'G', time: 4, duration: 4, confidence: 0.8, beat: 2 },
    { chord: 'Am', time: 8, duration: 4, confidence: 0.8, beat: 3 },
    { chord: 'F', time: 12, duration: 4, confidence: 0.8, beat: 4 }
];

const MAX_AUDIO_DURATION = 120; // Maximum duration for audio analysis in seconds

const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

export {
    API_BASE_URL,
    CHORDS_API_ENDPOINT,
    AUTH_API_ENDPOINT,
    HEALTH_CHECK_ENDPOINT,
    DEFAULT_CHORDS,
    MAX_AUDIO_DURATION,
    USER_ROLES
};