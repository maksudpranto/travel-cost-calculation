"use client";

import React from 'react';
import Link from 'next/link';
import { Map as MapIcon, Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#10B17D] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#10B17D]/20">
                <MapIcon size={22} />
              </div>
              <span className="text-xl font-black text-white tracking-tight">TravelCost</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs font-medium">
              The smartest way to track, split, and settle travel expenses with your friends. Focus on the memories, we'll handle the math.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-[#10B17D] transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-[#10B17D] transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-[#10B17D] transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-[#10B17D] transition-colors"><Github size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/mobile-app" className="hover:text-white transition-colors">Mobile App</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#10B17D] shrink-0" />
                <span>support@travelcost.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#10B17D] shrink-0" />
                <span>+8801756610535</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#10B17D] shrink-0" />
                <span>201 North Ibrahimpur, Dhaka - 1206</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© {currentYear} TravelCost Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
