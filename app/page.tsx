"use client";

import React from 'react';
import Link from 'next/link';
import { Map, ArrowRight, CheckCircle2, Wallet, Users, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#41644A] selection:text-white">

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#41644A] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Map size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Trip Manager</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-[#41644A] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-[#41644A] text-white text-sm font-bold rounded-xl hover:bg-[#2e4a34] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            The #1 Travel Expense Tracker
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
            Split Trip Costs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#41644A] to-emerald-600">
              Without the Drama
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Stop arguing about who paid for dinner. Track expenses, calculate balances, and settle debts instantly with Trip Manager.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#41644A] text-white font-bold rounded-2xl hover:bg-[#2e4a34] hover:scale-105 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              Start Tracking Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
               Sign In
            </Link>
          </div>

          {/* Trust Text */}
          <p className="text-sm text-gray-400 pt-4">No credit card required · Free forever</p>
        </div>
      </section>

      {/* --- VISUAL MOCKUP --- */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl p-2 sm:p-4 shadow-2xl ring-1 ring-gray-900/10">
           <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative aspect-video flex items-center justify-center">
              {/* Abstract Representation of Dashboard */}
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-gray-300 space-y-4">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <BarChart3 size={32} />
                 </div>
                 <p className="font-medium text-gray-400">Your Dashboard Preview</p>
              </div>

              {/* Optional: You can replace the div above with an actual screenshot:
                  <img src="/dashboard-screenshot.png" className="w-full h-full object-cover" />
              */}
           </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to stay on budget</h2>
            <p className="text-gray-500">We handle the math so you can handle the adventure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Expenses</h3>
              <p className="text-gray-500 leading-relaxed">
                Log every coffee, ticket, and meal. We categorize and organize everything for you instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Split Costs</h3>
              <p className="text-gray-500 leading-relaxed">
                Add friends to your trip. We automatically calculate who owes who, down to the last cent.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-500 leading-relaxed">
                Your data is stored locally on your device or securely in your account. You are in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">How it works</h2>

          <div className="space-y-12">
            {[
              { title: 'Create a Trip', desc: 'Give your trip a name, set dates, and invite your friends.', step: '01' },
              { title: 'Log Expenses', desc: 'Anyone can add expenses. We support multiple currencies and categories.', step: '02' },
              { title: 'Settle Up', desc: 'See a clear summary of debts. One click to see who pays whom.', step: '03' }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 md:gap-10 items-start">
                <div className="text-4xl font-black text-gray-100 leading-none select-none">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-24 px-6 bg-[#41644A]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to travel stress-free?</h2>
          <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who trust Trip Manager to handle their finances while they enjoy the view.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#41644A] font-bold rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
          >
            Create Your Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#41644A] rounded-lg flex items-center justify-center text-white">
               <Map size={16} />
            </div>
            <span className="text-lg font-bold text-gray-100">Trip Manager</span>
          </div>

          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-xs text-gray-600">© 2024 Trip Manager Inc.</p>
        </div>
      </footer>

    </div>
  );
}