import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserData } from '../services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
      
      setIsLoading(false);
    };

    // Small delay to ensure consistency (like iOS app)
    setTimeout(checkAuth, 300);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
