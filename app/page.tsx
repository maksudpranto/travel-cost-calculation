"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map, ArrowRight, Wallet, Users, BarChart3, ShieldCheck, LogIn, Menu, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#FA5C5C] selection:text-white">

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${scrolled ? 'bg-[#FA5C5C] text-white' : 'bg-white/20 text-white backdrop-blur-sm'
              }`}>
              <Map size={22} />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
              }`}>
              Trip Manager
            </span>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 bg-[#FA5C5C] text-white hover:bg-[#D43E3E]"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/sign-in"
                  className={`font-medium transition-colors hover:opacity-80 ${scrolled ? 'text-gray-600' : 'text-white/90'
                    }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-in?mode=signup"
                  className="px-5 py-2.5 font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 bg-[#FA5C5C] text-white hover:bg-[#D43E3E]"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className={scrolled ? 'text-gray-900' : 'text-white'} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4">
            {session ? (
              <Link
                href="/dashboard"
                className="w-full px-5 py-3 bg-[#FA5C5C] text-white font-bold rounded-xl text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="w-full px-5 py-3 text-gray-700 font-bold text-center border border-gray-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-in?mode=signup"
                  className="w-full px-5 py-3 bg-[#FA5C5C] text-white font-bold rounded-xl text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/new_hero_bg.png"
            alt="Scenic travel background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-8 pt-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-bold uppercase tracking-wider border border-white/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
            The #1 Travel Expense Tracker
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Adventure Awaits. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-teal-400">
              Finance Doesn't.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
            Stop arguing about who paid for dinner. Track expenses, calculate balances, and settle debts instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              href={session ? "/dashboard" : "/sign-in"}
              className="w-full sm:w-auto px-8 py-4 bg-[#FA5C5C] text-white font-bold rounded-2xl hover:bg-[#D43E3E] hover:scale-105 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-lg border-2 border-transparent"
            >
              {session ? "Go to Dashboard" : "Start Tracking Free"}
            </Link>
            {!session && (
              <Link
                href="/sign-in"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center gap-2 text-lg"
              >
                Log In
              </Link>
            )}

          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/70 rounded-full animate-scroll-down"></div>
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

      {/* --- HOW IT WORKS (Glassmorphism Cards) --- */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-6">How it works</h2>
            <p className="text-xl text-gray-500">Three simple steps to financial peace of mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a Trip",
                desc: "Name your adventure, set the currency, and invite your travel buddies instantly via link.",
                color: "bg-blue-500",
                shadow: "shadow-blue-200"
              },
              {
                step: "02",
                title: "Log Expenses",
                desc: "Paid for dinner? Add it in seconds. Split it equally, by percentage, or exact amounts.",
                color: "bg-emerald-500",
                shadow: "shadow-emerald-200"
              },
              {
                step: "03",
                title: "Settle Up",
                desc: "We calculate the most efficient way to pay everyone back. Minimal transactions, maximum happiness.",
                color: "bg-purple-500",
                shadow: "shadow-purple-200"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className={`absolute inset-0 ${item.color} rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center font-bold text-lg mb-6 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PERFECT FOR... (Visual Cards) --- */}
      <section className="py-24 bg-gray-900 text-white relative isolate overflow-hidden">
        <Image
          src="/new_hero_bg.png"
          alt="Background"
          fill
          className="object-cover opacity-10 blur-sm -z-10"
        />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black mb-4">Perfect for every journey</h2>
              <p className="text-gray-400 text-lg">Whether you're backpacking solo or vacationing with the whole family.</p>
            </div>
            <Link
              href="/sign-in?mode=signup"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              Start Your Journey <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Couples", icon: "❤️", desc: "Keep track of shared costs properly." },
              { title: "Roommates", icon: "🏠", desc: "Split rent, utilities, and groceries." },
              { title: "Road Trips", icon: "🚗", desc: "Gas, snacks, and motels sorted." },
              { title: "Friends", icon: "🧑‍🤝‍🧑", desc: "International group holidays made easy." },
            ].map((card, i) => (
              <div key={i} className="bg-gray-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-gray-800/80 transition-colors">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FA5C5C] rounded-lg flex items-center justify-center text-white">
              <Map size={16} />
            </div>
            <span className="text-lg font-bold text-gray-100">Trip Manager</span>
          </div>

          <p className="text-xs text-gray-600">© 2024 Trip Manager Inc.</p>
        </div>
      </footer>

    </div>
  );
}