"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map as MapIcon, ArrowRight, Wallet, Users, BarChart3, ShieldCheck, LogIn, Menu, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import Footer from '@/app/components/Footer';

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
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#10B17D] selection:text-white">

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${scrolled ? 'bg-[#10B17D] text-white shadow-lg shadow-[#10B17D]/20' : 'bg-white/20 text-white backdrop-blur-sm'
              }`}>
              <MapIcon size={22} />
            </div>
            <span className={`text-xl font-black tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
              }`}>
              TravelCost
            </span>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 bg-[#10B17D] text-white hover:bg-[#0D8F65]"
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
                  className="px-5 py-2.5 font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 bg-[#10B17D] text-white hover:bg-[#0D8F65]"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={scrolled ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu className={scrolled ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-2xl p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-4 border-t border-gray-100">
            {session ? (
              <Link
                href="/dashboard"
                className="w-full px-5 py-4 bg-[#10B17D] text-white font-bold rounded-2xl text-center shadow-lg shadow-[#10B17D]/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="w-full px-5 py-4 text-gray-700 font-bold text-center border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-in?mode=signup"
                  className="w-full px-5 py-4 bg-[#10B17D] text-white font-bold rounded-2xl text-center shadow-lg shadow-[#10B17D]/20"
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-8 pt-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[10px] md:text-sm font-bold uppercase tracking-widest border border-white/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[#10B17D] animate-pulse"></span>
            The #1 Travel Expense Tracker
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Adventure Awaits. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B17D] to-teal-400">
              Finance Doesn't.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
            Stop arguing about who paid for dinner. Track expenses, calculate balances, and settle debts instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              href={session ? "/dashboard" : "/sign-in?mode=signup"}
              className="w-full sm:w-auto px-10 py-5 bg-[#10B17D] text-white font-bold rounded-2xl hover:bg-[#0D8F65] hover:scale-105 transition-all shadow-xl hover:shadow-[#10B17D]/30 flex items-center justify-center gap-3 text-lg"
            >
              {session ? "Go to Dashboard" : "Start Tracking Free"}
            </Link>
            {!session && (
              <Link
                href="/sign-in"
                className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/20 transition-all border-2 border-white/30 flex items-center justify-center gap-2 text-lg"
              >
                Log In
              </Link>
            )}

          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </section>


      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Stay on budget</h2>
            <p className="text-gray-500 font-medium">We handle the math so you can handle the adventure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#10B17D]/10 rounded-2xl flex items-center justify-center text-[#10B17D] mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Expenses</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Log every coffee, ticket, and meal. We categorize and organize everything for you instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Split Costs</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Add friends to your trip. We automatically calculate who owes who, down to the last cent.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Your data is stored locally on your device or securely in your account. You are in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Glassmorphism Cards) --- */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">How it works</h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium tracking-tight">Three simple steps to financial peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a Trip",
                desc: "Name your adventure, set the currency, and invite your travel buddies instantly via link.",
                color: "bg-blue-600",
                shadow: "shadow-blue-200"
              },
              {
                step: "02",
                title: "Log Expenses",
                desc: "Paid for dinner? Add it in seconds. Split it equally, by percentage, or exact amounts.",
                color: "bg-[#10B17D]",
                shadow: "shadow-[#10B17D]/20"
              },
              {
                step: "03",
                title: "Settle Up",
                desc: "We calculate the most efficient way to pay everyone back. Minimal transactions, maximum happiness.",
                color: "bg-purple-600",
                shadow: "shadow-purple-200"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className={`absolute inset-0 ${item.color} rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center font-black text-lg mb-6 shadow-lg ${item.shadow}`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
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
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-center md:text-left">
            <div className="max-w-xl mx-auto md:mx-0">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Perfect for every journey</h2>
              <p className="text-gray-400 text-lg font-medium tracking-tight">Whether you're backpacking solo or vacationing with the whole family.</p>
            </div>
            <Link
              href="/sign-in?mode=signup"
              className="w-full md:w-auto px-10 py-4 bg-[#10B17D] hover:bg-[#0D8F65] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#10B17D]/20 hover:shadow-[#10B17D]/40 active:scale-95"
            >
              Start Your Journey <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Couples", icon: "❤️", desc: "Keep track of shared costs properly." },
              { title: "Roommates", icon: "🏠", desc: "Split rent, utilities, and groceries." },
              { title: "Road Trips", icon: "🚗", desc: "Gas, snacks, and motels sorted." },
              { title: "Friends", icon: "🧑‍🤝‍🧑", desc: "International group holidays made easy." },
            ].map((card, i) => (
              <div key={i} className="bg-gray-800/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:bg-gray-800/60 transition-colors group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">{card.icon}</div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

    </div>
  );
}