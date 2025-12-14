"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoginModal } from '@/components/LoginModal';
import type { User } from '@/lib/types';
import { useCart } from './useCart';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  showLogin: () => void;
  hideLogin: () => void;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginVisible, setLoginVisible] = useState(false);
  const { clearCart } = useCart();

  const showLogin = () => setLoginVisible(true);
  const hideLogin = () => setLoginVisible(false);

  const login = (email: string, name: string) => {
    // In a real app, you'd get this from your auth provider
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    setUser({ id: `user_${Date.now()}`, email, name, initials });
    setIsLoggedIn(true);
    hideLogin();
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    clearCart();
  };

  const value = {
    isLoggedIn,
    user,
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
