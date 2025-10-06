import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      console.log('Reducer: Setting isAuthenticated to true');
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      try {
        dispatch({ type: 'USER_LOADING' });
        const res = await axios.get('http://localhost:5000/api/auth/profile');
        
        dispatch({
          type: 'USER_LOADED',
          payload: res.data.data.user
        });
      } catch (error) {
        console.error('Load user error:', error);
        dispatch({
          type: 'AUTH_ERROR',
          payload: error.response?.data?.message || 'Failed to load user'
        });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: 'USER_LOADING' });
      
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          token: res.data.data.token,
          user: res.data.data.user
        }
      });

      setAuthToken(res.data.data.token);
      
      return { success: true, message: res.data.message };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response?.status === 503) {
        errorMessage = 'Database not available. Please ensure MongoDB is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Make sure the backend is running.';
      }
      
      dispatch({
        type: 'REGISTER_FAIL',
        payload: errorMessage
      });
      return { 
        success: false, 
        message: errorMessage, 
        errors: error.response?.data?.errors,
        instructions: error.response?.data?.instructions
      };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: 'USER_LOADING' });
      
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      console.log('Login successful, dispatching LOGIN_SUCCESS');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.data.data.token,
          user: res.data.data.user
        }
      });

      setAuthToken(res.data.data.token);
      
      return { success: true, message: res.data.message };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 503) {
        errorMessage = 'Database not available. Please ensure MongoDB is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Make sure the backend is running.';
      }
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errorMessage
      });
      return { 
        success: false, 
        message: errorMessage,
        instructions: error.response?.data?.instructions
      };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setAuthToken(null);
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', userData);
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data.user
      });
      
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, message: errorMessage, errors: error.response?.data?.errors };
    }
  };

  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, []);

  // Context value
  const contextValue = {
    ...state,
    register,
    login,
    logout,
    clearErrors,
    updateProfile,
    loadUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;