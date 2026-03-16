import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize authentication state
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    if (token && isAuthenticated) {
      setUser(user);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    setError(null);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        authService.setAuth(result.token, result.user, result.tokenExpiration);
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.logout();
      
      if (result.success) {
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        authService.setAuth(result.token, result.user, result.tokenExpiration);
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.refreshToken();
      
      if (result.success) {
        authService.setAuth(result.token, result.user, result.tokenExpiration);
        // User remains the same, just token refreshed
      } else {
        setError(result.message);
        // If refresh fails, user must login again
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError(err.message || 'Token refresh failed');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.forgotPassword(email);
      return result;
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.resetPassword(resetData);
      return result;
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (email, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.verifyToken(email, token);
      return result;
    } catch (err) {
      setError(err.message || 'Token verification failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(prev => ({ ...prev, ...result.data }));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyToken,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthProvider };
