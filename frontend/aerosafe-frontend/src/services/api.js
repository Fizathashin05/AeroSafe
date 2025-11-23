const API_BASE_URL = 'http://localhost:5121/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to parse response body for useful error information
    const body = await response.json().catch(() => null);
    let message = `HTTP error! status: ${response.status}`;

    if (body) {
      // ASP.NET ValidationProblemDetails typically returns 'errors' object
      if (body.errors && typeof body.errors === 'object') {
        // Join all error messages into one string
        const parts = Object.values(body.errors).flat();
        message = parts.join(' | ');
      } else if (body.message) {
        message = body.message;
      } else {
        message = JSON.stringify(body);
      }
    }

    console.error('API error', response.status, body);
    throw new Error(message);
  }

  return response.json();
};

// Authentication API calls
export const authAPI = {
  // Admin Signup
  adminSignup: async (data) => {
    return apiRequest('/auth/admin/signup', {
      method: 'POST',
      body: JSON.stringify({
        Name: data.name,
        Email: data.email,
        AdminId: data.adminId,
        Password: data.password,
        ConfirmPassword: data.confirmPassword,
      }),
    });
  },

  // Pilot Signup
  pilotSignup: async (data) => {
    return apiRequest('/auth/pilot/signup', {
      method: 'POST',
      body: JSON.stringify({
        Name: data.name,
        Email: data.email,
        PilotId: data.pilotId,
        Password: data.password,
        ConfirmPassword: data.confirmPassword,
      }),
    });
  },

  // Login (for both Admin and Pilot)
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });
  },
};

// Helper to save auth data
export const saveAuthData = (token, user) => {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
};

// Helper to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Helper to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

