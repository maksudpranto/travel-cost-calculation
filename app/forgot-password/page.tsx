"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight, User, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { checkContactExists, resetPassword } = useAuth();

  const handleVerifyContact = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (checkContactExists(contact)) {
      setStep(2);
    } else {
      setError("No account found with this email or phone.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await resetPassword(contact, newPassword);
    setIsLoading(false);
    setStep(3);
  };

  const inputStyle = "w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#41644A] transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">

        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="text-[#41644A]" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mt-1">Enter your email or phone to find your account.</p>
            </div>
            <form onSubmit={handleVerifyContact} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Email or Phone Number"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className={inputStyle}
                />
              </div>
              {error && <p className="text-rose-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-[#41644A] hover:bg-[#2e4a34] text-white font-bold py-3 rounded-xl transition-all">Verify Account</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
              <p className="text-gray-500 text-sm mt-1">For <span className="font-semibold text-gray-700">{contact}</span></p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input required type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputStyle} />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#41644A] hover:bg-[#2e4a34] text-white font-bold py-3 rounded-xl transition-all">
                {isLoading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">All Set!</h1>
            <p className="text-gray-500 mb-6">Your password has been successfully updated.</p>
            <button onClick={() => router.push('/login')} className="w-full bg-[#41644A] hover:bg-[#2e4a34] text-white font-bold py-3 rounded-xl transition-all">
              Go to Login
            </button>
          </div>
        )}

        {step !== 3 && (
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-[#41644A] transition-colors">Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}