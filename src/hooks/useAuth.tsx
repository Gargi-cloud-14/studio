
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginModal } from '@/components/LoginModal';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showLogin: () => void;
  hideLogin: () => void;
  login: (user: User) => void;
  logout: (onLogout?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginVisible, setLoginVisible] = useState(false);
  
  useEffect(() => {
    // In a real app, you'd check a token or session here.
    // For this mock-up, we'll just start with no user.
    setLoading(false);
  }, []);

  const showLogin = () => setLoginVisible(true);
  const hideLogin = () => setLoginVisible(false);

  const login = (user: User) => {
    setUser(user);
    hideLogin();
  };

  const logout = (onLogout?: () => void) => {
    setUser(null);
    if (onLogout) {
      onLogout();
    }
  };
  
  const value = {
    user,
    loading,
    showLogin,
    hideLogin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal isOpen={isLoginVisible} onClose={hideLogin} />
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
