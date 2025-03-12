"use client";
import { createContext, useState, useContext, ReactNode } from 'react';
import { login, logout } from '../services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (method: 'jwt' | 'oauth') => Promise<void>;
  logout: (method: 'jwt' | 'oauth') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (method: 'jwt' | 'oauth') => {
    try {
      await login(method);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async (method: 'jwt' | 'oauth') => {
    try {
      await logout(method);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};
