"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Map, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(contact, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.message);
    }
  };

  const inputStyle = "w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#41644A] transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">

        <div className="w-16 h-16 bg-[#41644A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Map className="text-[#41644A]" size={32} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Sign in with Email or Phone</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input required type="text" placeholder="Email or Phone Number" value={contact} onChange={(e) => setContact(e.target.value)} className={inputStyle} />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyle} />
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" class="text-xs font-medium text-gray-500 hover:text-[#41644A] transition-colors cursor-pointer">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-rose-500 text-sm text-center font-medium animate-pulse">{error}</p>}

          {/* UPDATED BUTTON STYLE: Added cursor-pointer, shadow, and hover scaling */}
          <button
            type="submit" disabled={isLoading}
            className="w-full bg-[#41644A] hover:bg-[#2e4a34] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 cursor-pointer shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account? <Link href="/register" className="text-[#41644A] font-bold hover:underline cursor-pointer">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}