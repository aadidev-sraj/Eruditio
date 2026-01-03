/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

// Get the API URL from environment variable
// In production, set REACT_APP_API_URL to your Render backend URL
// In development, it defaults to localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006';

/**
 * Helper function to construct full API endpoint URLs
 * @param {string} path - API endpoint path (e.g., '/api/auth/login')
 * @returns {string} - Full URL to the API endpoint
 */
export const getApiUrl = (path) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};

// Export commonly used API endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
    AUTH_SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    AUTH_FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,

    // Profile
    PROFILE: `${API_BASE_URL}/api/profile`,

    // Courses
    COURSES: `${API_BASE_URL}/api/courses`,
    COURSES_SEARCH: `${API_BASE_URL}/api/courses/search`,
    COURSES_INSTRUCTOR: `${API_BASE_URL}/api/courses/instructor`,

    // Enrollments
    ENROLLMENTS: `${API_BASE_URL}/api/enrollments`,
    ENROLL: `${API_BASE_URL}/api/enroll`,

    // Assignments
    ASSIGNMENTS: `${API_BASE_URL}/api/assignments`,

    // YouTube
    YOUTUBE_SEARCH: `${API_BASE_URL}/api/youtube/search`,

    // Upload
    UPLOAD: `${API_BASE_URL}/api/upload`,
};

export default API_BASE_URL;
