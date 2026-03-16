import apiClient from './api.js';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = null;
    this.tokenExpiration = null;
    
    // Initialize user from stored token if available
    if (this.token) {
      this.validateToken();
    }
  }

  // Get current authentication state
  get isAuthenticated() {
    return !!this.token && !this.isTokenExpired();
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get JWT token
  getToken() {
    return this.token;
  }

  // Login user and store token
  async login(credentials) {
    try {
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        this.tokenExpiration = new Date(Date.now() + (60 * 60 * 1000)); // 60 minutes
        
        // Store token in localStorage
        localStorage.setItem('auth_token', token);
        
        return { success: true, user, token };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  // Logout user and clear token
  async logout() {
    try {
      const response = await apiClient.logout();
      
      // Clear authentication state
      this.token = null;
      this.user = null;
      this.tokenExpiration = null;
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed. Please try again.' };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.register(userData);
      
      if (response.success) {
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        this.tokenExpiration = new Date(Date.now() + (60 * 60 * 1000)); // 60 minutes
        
        // Store token in localStorage
        localStorage.setItem('auth_token', token);
        
        return { success: true, user, token };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.refreshToken();
      
      if (response.success) {
        const { token } = response.data;
        
        this.token = token;
        this.tokenExpiration = new Date(Date.now() + (60 * 60 * 1000)); // 60 minutes
        
        // Update stored token
        localStorage.setItem('auth_token', token);
        
        return { success: true, token };
      }
      
      return { success: false, message: 'Token refresh failed. Please login again.' };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, message: 'Token refresh failed. Please login again.' };
    }
  }

  // Request password reset
  async forgotPassword(email) {
    try {
      const response = await apiClient.forgotPassword({ email });
      
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, message: 'Password reset request failed. Please try again.' };
    }
  }

  // Reset password with token
  async resetPassword(resetData) {
    try {
      const response = apiClient.resetPassword(resetData);
      
      return response;
    } 
    catch (error) {
      console.error('Password reset error:', error);
      return { success: false, message: 'Password reset failed. Please try again.' };
    }
  }

  // Verify reset token
  async verifyToken(email, token) {
    try {
      const response = apiClient.verifyToken(email, token);
      
      return response;
    } catch (error) {
      console.error('Token verification error:', error);
      return { success: false, message: 'Token verification failed. Please try again.' };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.updateProfile(profileData);
      
      if (response.success) {
        this.user = { ...this.user, ...response.data };
        return response;
      }
      
      return { success: false, message: 'Profile update failed. Please try again.' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Profile update failed. Please try again.' };
    }
  }

  // Validate token and update user state
  validateToken() {
    if (!this.token) {
      this.clearAuth(); // Use clearAuth instead of logout to avoid API call
      return false;
    }
    
    if (this.isTokenExpired()) {
      this.clearAuth(); // Use clearAuth instead of logout to avoid API call
      return false;
    }
    
    return true;
  }

  // Simple validation without API calls
  isValidToken() {
    return this.token && !this.isTokenExpired();
  }

  // Check if token is expired
  isTokenExpired() {
    return Date.now() > this.tokenExpiration;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.isValidToken();
  }

  // Set authentication state
  setAuth(token, user, expiration) {
    this.token = token;
    this.user = user;
    this.tokenExpiration = expiration;
    
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Clear authentication state
  clearAuth() {
    this.token = null;
    this.user = null;
    this.tokenExpiration = null;
    
    localStorage.removeItem('auth_token');
  }

  // Initialize authentication state
  initAuth() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      this.token = token;
      this.validateToken();
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
