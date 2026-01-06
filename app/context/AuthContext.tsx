"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  contact: string;
  username: string;
  password: string;
  profilePicture?: string;
  address?: string; // --- NEW FIELD ---
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (contact: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (contact: string, username: string, pass: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (contact: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkContactExists: (contact: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  resetPassword: async () => ({ success: false, message: '' }),
  updateProfile: async () => ({ success: false, message: '' }),
  logout: () => {},
  checkContactExists: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionContact = localStorage.getItem('trip_manager_session');
    const users = JSON.parse(localStorage.getItem('trip_manager_users') || '[]');

    if (sessionContact) {
      const user = users.find((u: User) => u.contact === sessionContact);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem('trip_manager_users') || '[]');

  const login = async (contact: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const user = users.find((u: User) => u.contact === contact && u.password === pass);

    if (user) {
      localStorage.setItem('trip_manager_session', contact);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = async (contact: string, username: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    if (users.find((u: User) => u.contact === contact)) {
      return { success: false, message: 'Account already registered' };
    }
    const newUser = { contact, username, password: pass };
    localStorage.setItem('trip_manager_users', JSON.stringify([...users, newUser]));
    return { success: true, message: 'Registration successful' };
  };

  const resetPassword = async (contact: string, newPass: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const userIndex = users.findIndex((u: User) => u.contact === contact);
    if (userIndex === -1) return { success: false, message: 'Account not found' };

    users[userIndex].password = newPass;
    localStorage.setItem('trip_manager_users', JSON.stringify(users));
    return { success: true, message: 'Password updated successfully' };
  };

  const updateProfile = async (data: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) return { success: false, message: 'No active session' };

    const users = getUsers();
    const userIndex = users.findIndex((u: User) => u.contact === currentUser.contact);

    if (userIndex === -1) return { success: false, message: 'User not found' };

    // Update user object
    const updatedUser = { ...users[userIndex], ...data };

    // Save back to storage
    users[userIndex] = updatedUser;
    localStorage.setItem('trip_manager_users', JSON.stringify(users));

    // Update session state
    setCurrentUser(updatedUser);

    if (data.contact) {
      localStorage.setItem('trip_manager_session', data.contact);
    }

    return { success: true, message: 'Profile updated successfully' };
  };

  const checkContactExists = (contact: string) => {
    const users = getUsers();
    return users.some((u: User) => u.contact === contact);
  };

  const logout = () => {
    localStorage.removeItem('trip_manager_session');
    setCurrentUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, register, resetPassword, updateProfile, logout, checkContactExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);