import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Basic user type (matching your backend's user model)
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getToken: () => string | null; // This function will now be largely symbolic or return null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => null; // Token is httpOnly, cannot be read by JS

  // Function to fetch user profile using the cookie (browser sends it automatically)
  const fetchUserProfile = async () => { // No token parameter needed
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: Send cookies with the request
      });

      if (!response.ok) {
        // If server responds with 401/403 or other error, it means session is invalid
        // No need to remove token from localStorage as it's httpOnly
        throw new Error('Failed to fetch user profile or session expired');
      }

      const data = await response.json();
      if (data.success) {
        const fetchedUser: User = { ...data.data, role: data.data.role || 'user' };
        setUser(fetchedUser);
        return fetchedUser;
      } else {
        setUser(null); // Clear user if backend says not successful
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      // On initial load, try to fetch user profile. If successful, user is logged in via cookie.
      await fetchUserProfile();
      if (isMounted) {
        setIsLoading(false);
      }
    };
    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // IMPORTANT: Receive cookie from response
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Token is now set as httpOnly cookie by backend. No localStorage.setItem('token').
        const loggedInUser: User = { ...data.user, role: data.user.role || 'user' };
        setUser(loggedInUser);
        toast.success('Successfully logged in');
        return true;
      } else {
        toast.error(data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include', // IMPORTANT: Receive cookie from response
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Token is now set as httpOnly cookie by backend. No localStorage.setItem('token').
        const registeredUser: User = { ...data.user, role: data.user.role || 'user' };
        setUser(registeredUser);
        toast.success('Account created successfully');
        return true;
      } else {
        toast.error(data.message || 'Failed to create account');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => { // Make logout async to await backend call
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'GET', // Or POST, depends on your backend route
        credentials: 'include', // IMPORTANT: Send cookie to backend to clear it
      });

      if (!response.ok) {
        throw new Error('Failed to log out on server.');
      }
      
      setUser(null);
      localStorage.removeItem('adminSession'); // Clear admin session
      toast.info('You have been logged out');
      navigate('/');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast.error(error.message || 'Failed to log out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};