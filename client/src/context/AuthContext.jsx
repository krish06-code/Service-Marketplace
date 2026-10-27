import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { signInWithGoogle, signOutFirebase } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const token = res.data.token || res.data.data?.token;
    const user = res.data.user || res.data.data?.user;
    if (token) localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const token = res.data.token || res.data.data?.token;
    const user = res.data.user || res.data.data?.user;
    if (token) localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  /**
   * Google Sign-In flow:
   * 1. Firebase popup → get ID token
   * 2. Send ID token to backend → backend verifies with Firebase Admin → returns app JWT
   * 3. Store JWT and update context (same shape as email/password login)
   */
  const googleSignIn = async (role) => {
    // Step 1: Firebase popup
    const { idToken } = await signInWithGoogle();

    // Step 2: Exchange ID token for app JWT
    const res = await authAPI.googleAuth(idToken, role);
    const token = res.data.token || res.data.data?.token;
    const user  = res.data.user  || res.data.data?.user;

    // Step 3: Persist session exactly like email/password login
    if (token) localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore
    }
    // Also sign out from Firebase so the popup doesn't auto-sign-in next time
    try { await signOutFirebase(); } catch (e) { /* ignore */ }
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, googleSignIn, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

