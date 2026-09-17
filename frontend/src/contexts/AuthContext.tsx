import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authApi, getToken, setToken, removeToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password?: string) => Promise<User | null>;
  register: (data: any) => Promise<boolean>;
  registerMentor: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ere_tn_user') || localStorage.getItem('edunova_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await authApi.me();
          if (res && res.id) {
            const currentUser: User = {
              id: res.id,
              email: res.email,
              fullName: res.fullName,
              phone: res.phone,
              role: res.role,
              avatarUrl: res.avatarUrl || (res.role === 'STUDENT'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
              isVerified: res.status === 'ACTIVE'
            };
            setUser(currentUser);
            localStorage.setItem('ere_tn_user', JSON.stringify(currentUser));
            localStorage.setItem('edunova_user', JSON.stringify(currentUser));
          }
        } catch {
          // Keep cached user if offline
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ere_tn_user', JSON.stringify(user));
      localStorage.setItem('edunova_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ere_tn_user');
      localStorage.removeItem('edunova_user');
    }
  }, [user]);

  const login = async (email: string, password: string = 'Password@123'): Promise<User | null> => {
    try {
      const res = await authApi.login({ email, password });
      if (res && res.token) {
        setToken(res.token);
        const loggedInUser: User = {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          phone: res.phone,
          role: res.role,
          avatarUrl: res.avatarUrl || (res.role === 'STUDENT'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
          isVerified: res.status === 'ACTIVE'
        };
        setUser(loggedInUser);
        return loggedInUser;
      }
      return null;
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await authApi.register(data);
      if (res && res.token) {
        setToken(res.token);
        const newUser: User = {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          phone: res.phone,
          role: res.role || 'STUDENT',
          avatarUrl: res.avatarUrl,
          isVerified: res.status === 'ACTIVE'
        };
        setUser(newUser);
        return true;
      }
    } catch (err: any) {
      throw err;
    }
    return false;
  };

  const registerMentor = async (data: any): Promise<boolean> => {
    try {
      const res = await authApi.registerMentor(data);
      if (res && res.token) {
        setToken(res.token);
        const newUser: User = {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          phone: res.phone,
          role: res.role || 'MENTOR',
          avatarUrl: res.avatarUrl,
          isVerified: res.status === 'ACTIVE'
        };
        setUser(newUser);
        return true;
      }
    } catch (err: any) {
      throw err;
    }
    return false;
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('ere_tn_user');
    localStorage.removeItem('edunova_user');
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        registerMentor,
        logout,
        updateUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
