'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEMO_USERS, UserRole } from '@lootupspace/shared';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  kycStatus?: string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setDefaults = useCallback(() => {
    const defaultUser: User = {
      id: DEMO_USERS.CUSTOMER.id,
      name: DEMO_USERS.CUSTOMER.name,
      phone: DEMO_USERS.CUSTOMER.phone,
      email: DEMO_USERS.CUSTOMER.email,
      role: UserRole.CUSTOMER,
      kycStatus: 'VERIFIED'
    };
    setUser(defaultUser);
    setToken('mock_jwt_customer_token');
    localStorage.setItem('lootup_token', 'mock_jwt_customer_token');
    localStorage.setItem('lootup_user', JSON.stringify(defaultUser));
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('lootup_token');
    const savedUser = localStorage.getItem('lootup_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        setDefaults();
      }
    } else {
      setDefaults();
    }
    setIsLoading(false);
  }, [setDefaults]);

  const getAuthApiBase = () => {
    const configured =
      typeof import.meta !== 'undefined'
        ? ((import.meta as any).env?.VITE_API_URL as string | undefined)
        : undefined;
    if (configured) return configured.replace(/\/$/, '');
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      return '/api/v1';
    }
    return '';
  };

  const login = useCallback(async (phone: string, otp: string) => {
    const apiBase = getAuthApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp })
        });
        const data = await res.json();
        if (data.token && data.user) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('lootup_token', data.token);
          localStorage.setItem('lootup_user', JSON.stringify(data.user));
          return;
        }
      } catch {
        // Fallback to local demo session when API backend is offline
      }
    }
    const u: User = {
      id: `user_${Date.now()}`,
      name: 'Aarav Sharma',
      phone,
      role: UserRole.CUSTOMER,
      kycStatus: 'VERIFIED'
    };
    const mockToken = 'mock_token_' + Date.now();
    setToken(mockToken);
    setUser(u);
    localStorage.setItem('lootup_token', mockToken);
    localStorage.setItem('lootup_user', JSON.stringify(u));
  }, []);

  const demoLogin = useCallback(async (targetRole: UserRole) => {
    const apiBase = getAuthApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/auth/demo-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: targetRole })
        });
        const data = await res.json();
        if (data.token && data.user) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('lootup_token', data.token);
          localStorage.setItem('lootup_user', JSON.stringify(data.user));
          return;
        }
      } catch {
        // Fallback to local demo profile
      }
    }

    let demoConfig = DEMO_USERS.CUSTOMER;
    if (targetRole === UserRole.DRIVER) demoConfig = DEMO_USERS.DRIVER;
    if (targetRole === UserRole.WAREHOUSE) demoConfig = DEMO_USERS.WAREHOUSE;
    if (targetRole === UserRole.ADMIN) demoConfig = DEMO_USERS.ADMIN;

    const u: User = {
      id: demoConfig.id,
      name: demoConfig.name,
      phone: demoConfig.phone,
      email: demoConfig.email,
      role: targetRole,
      kycStatus: 'VERIFIED'
    };
    const mockToken = `mock_${targetRole.toLowerCase()}_token`;
    setUser(u);
    setToken(mockToken);
    localStorage.setItem('lootup_token', mockToken);
    localStorage.setItem('lootup_user', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lootup_token');
    localStorage.removeItem('lootup_user');
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem('lootup_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      role: user?.role || UserRole.CUSTOMER,
      isLoading,
      login,
      demoLogin,
      logout,
      updateUser
    }),
    [user, token, isLoading, login, demoLogin, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
