import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, tokenStore } from '@services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, try to restore the session.
  useEffect(() => {
    let active = true;
    async function restore() {
      const token = tokenStore.get();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await authApi.me();
        if (active) setUser(me);
      } catch {
        tokenStore.clear();
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { user: u, token } = await authApi.login(credentials);
    tokenStore.set(token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { user: u, token } = await authApi.register(payload);
    tokenStore.set(token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
