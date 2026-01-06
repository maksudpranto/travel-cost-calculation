"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, User, Lock, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', contact: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    const result = await register(formData.contact, formData.username, formData.password);
    setIsLoading(false);

    if (result.success) {
      router.push('/login');
    } else {
      setError(result.message);
    }
  };

  const inputStyle = "w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#41644A] transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Start managing your trips today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              required type="text" placeholder="Username"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className={inputStyle}
            />
          </div>

          <div className="relative">
            {/* Using a generic User icon, or you can use Smartphone/Mail */}
            <Smartphone className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              required
              type="text" // Allows email or numbers
              placeholder="Email or Phone Number"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
              className={inputStyle}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              required type="password" placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className={inputStyle}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              required type="password" placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              className={inputStyle}
            />
          </div>

          {error && <p className="text-rose-500 text-sm text-center">{error}</p>}

          <button
            type="submit" disabled={isLoading}
            className="w-full bg-[#41644A] hover:bg-[#2e4a34] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-[#41644A] font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}