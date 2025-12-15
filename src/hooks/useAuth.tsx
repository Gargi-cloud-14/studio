
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoginModal } from '@/components/LoginModal';
import type { User as FirebaseUser } from 'firebase/auth';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  showLogin: () => void;
  hideLogin: () => void;
  login: (user: FirebaseUser) => void;
  logout: (clearCart: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, loading, error } = useUser();
  const [isLoginVisible, setLoginVisible] = useState(false);
  
  const showLogin = () => setLoginVisible(true);
  const hideLogin = () => setLoginVisible(false);

  // This function is called from the LoginModal after a successful Firebase login
  const login = (firebaseUser: FirebaseUser) => {
    // The useUser hook will automatically update the user state.
    // We just need to close the modal.
    hideLogin();
  };

  const logout = async (clearCart: () => void) => {
    const auth = getAuth();
    await signOut(auth);
    // The useUser hook will automatically set user to null.
    clearCart();
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
