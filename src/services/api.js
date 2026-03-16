// API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    USER: `${API_BASE_URL}/auth/user`,
  },
  PASSWORD: {
    FORGOT: `${API_BASE_URL}/password/forgot`,
    RESET: `${API_BASE_URL}/password/reset`,
    VERIFY_TOKEN: `${API_BASE_URL}/password/verify-token`,
  },
  USER: {
    LIST: `${API_BASE_URL}/users`,
    GET: `${API_BASE_URL}/users/{id}`,
    UPDATE: `${API_BASE_URL}/users/{id}`,
    DELETE: `${API_BASE_URL}/users/{id}`,
    AUDIT_LOGS: `${API_BASE_URL}/users/{id}/audit-logs`,
  },
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  HEALTH: `${API_BASE_URL}/health`,
};

// API client class
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  }

  // Authentication methods
  async login(credentials) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
    });
  }

  async getUserProfile(token) {
    return this.request(API_ENDPOINTS.AUTH.USER, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Password methods
  async forgotPassword(email) {
    return this.request(API_ENDPOINTS.PASSWORD.FORGOT, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetData) {
    return this.request(API_ENDPOINTS.PASSWORD.RESET, {
      method: 'endpoints',
      body: JSON.stringify(resetData),
    });
  }

  async verifyToken(email, token) {
    return this.request(API_ENDPOINTS.PASSWORD.VERIFY_TOKEN, {
      method: 'POST',
      body: JSON.stringify({ email, token }),
    });
  }

  // User management methods
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.USER.LIST}?${queryString}` : API_ENDPOINTS.USER.LIST;
    
    return this.request(url);
  }

  async getUser(userId, token) {
    return this.request(API_ENDPOINTS.USER.GET.replace('{id}', userId), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateUser(userId, userData, token) {
    return this.request(API_ENDPOINTS.USER.UPDATE.replace('{id}', userId), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId, token) {
    return this.request(API_ENDPOINTS.USER.DELETE.replace('{id}', userId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getUserAuditLogs(userId, token, params = {}) {
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.USER.AUDIT_LOGS.replace('{id}', userId)}?${queryString}` : API_ENDPOINTS.USER.AUDIT_LOGS.replace('{id}', userId);
    
    return this.request(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Profile management
  async updateProfile(profileData, token) {
    return this.request(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  }

  // System methods
  async healthCheck() {
    return this.request(API_ENDPOINTS.HEALTH);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
