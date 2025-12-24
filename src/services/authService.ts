import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://circlapp.online/api/';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_fullname');
      localStorage.setItem('isLoggedIn', 'false');
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export interface LoginResponse {
  token: string;
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface UserData {
  user_id: number;
  email: string;
  fullname: string;
}

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<UserData> {
    const response = await api.post<LoginResponse>('/login/', {
      email: email.trim().toLowerCase(),
      password,
    });

    const { token, user_id, email: userEmail, first_name, last_name } = response.data;

    // Store authentication data
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_id', user_id.toString());
    localStorage.setItem('user_email', userEmail);
    
    const fullname = first_name && last_name ? `${first_name} ${last_name}` : userEmail;
    localStorage.setItem('user_fullname', fullname);
    localStorage.setItem('isLoggedIn', 'true');

    console.log('✅ Login successful:', { user_id, email: userEmail });

    return {
      user_id,
      email: userEmail,
      fullname,
    };
  },

  /**
   * Logout user and clear all stored data
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint (if it exists)
      await api.post('/logout/');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all stored data regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_fullname');
      localStorage.setItem('isLoggedIn', 'false');
      
      console.log('✅ Logout successful');
    }
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const hasToken = !!localStorage.getItem('auth_token');
    return isLoggedIn && hasToken;
  },

  /**
   * Get current user data from localStorage
   */
  getCurrentUser(): UserData | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    const user_id = localStorage.getItem('user_id');
    const email = localStorage.getItem('user_email');
    const fullname = localStorage.getItem('user_fullname');

    if (!user_id || !email) {
      return null;
    }

    return {
      user_id: parseInt(user_id, 10),
      email,
      fullname: fullname || email,
    };
  },

  /**
   * Send forgot password request
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post('/forgot-password/', {
      email: email.trim().toLowerCase(),
    });
    
    console.log('✅ Forgot password email sent to:', email);
  },
};

export default api;
