import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInWithGoogle, signUpWithEmail, signInWithEmail, logout } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const handleSignUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      await signUpWithEmail(email, password, displayName);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithEmail: handleSignInWithEmail,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
