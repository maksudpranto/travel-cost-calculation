"use client";

import React from 'react';
import { Map, LayoutDashboard, Calculator, Settings, LogOut, X, User as UserIcon, Moon, Sun, Edit2, Trash2 } from 'lucide-react';
import { Trip } from '../type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  trips: Trip[];
  activeTripId: number;
  onSelectTrip: (id: number) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

const scrollbarStyle = `
  .sidebar-scrollbar::-webkit-scrollbar { width: 4px; }
  .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
  .sidebar-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
`;

export const Sidebar = ({
  trips,
  activeTripId,
  onSelectTrip,
  onEditTrip,
  onDeleteTrip,
  isOpen,
  onClose,
  user,
  onEditProfile,
  onLogout
}: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'Trips', path: '/trips' },
    { icon: Calculator, label: 'Calculator', path: '/bulk_calculation' },
  ];

  return (
    <>
      <style>{scrollbarStyle}</style>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 pb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#10B17D] rounded-xl flex items-center justify-center shadow-lg shadow-[#10B17D]/20">
                <Map className="text-white" size={24} />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">TravelCost</span>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 space-y-8 sidebar-scrollbar">
            {/* Main Menu */}
            <div>
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.path} onClick={onClose}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 group
                      ${isActive(item.path)
                        ? 'bg-[#10B17D] text-white shadow-lg shadow-[#10B17D]/20'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#10B17D]'}
                    `}>
                      <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-[#10B17D]'} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Trip Selector (Only show if on dashboard) */}
            {pathname === '/dashboard' && trips.length > 0 && (
              <div>
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Switch</p>
                <div className="space-y-1">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className={`
                        group flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200
                        ${activeTripId === trip.id
                          ? 'bg-gray-50 text-[#10B17D]'
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                      onClick={() => onSelectTrip(trip.id)}
                    >
                      <div className="flex items-center gap-3 truncate flex-1">
                        <div className={`w-2 h-2 rounded-full ${activeTripId === trip.id ? 'bg-[#10B17D]' : 'bg-gray-200'}`}></div>
                        <span className="truncate font-medium text-xs">{trip.name}</span>
                      </div>

                      <div className={`flex items-center gap-1 ${activeTripId === trip.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); onEditTrip(trip); }}
                          className="p-1 hover:bg-white rounded-md text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip); }}
                          className="p-1 hover:bg-white rounded-md text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-3xl p-4 flex items-center justify-between group hover:bg-gray-100/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white" />
                  ) : (
                    <div className="w-10 h-10 bg-[#10B17D]/10 text-[#10B17D] rounded-xl flex items-center justify-center font-black ring-2 ring-white">
                      {user?.name?.charAt(0) || <UserIcon size={18} />}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-gray-900 truncate">{user?.name || 'Guest User'}</p>
                  <p className="text-[10px] font-bold text-[#10B17D] uppercase tracking-wider">Administrator</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="p-2 text-gray-400 hover:text-[#10B17D] hover:bg-white rounded-xl transition-all active:scale-90 cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all active:scale-90 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <Link href="/" className="mt-4 block text-center py-2 text-[10px] font-bold text-gray-400 hover:text-[#10B17D] transition-colors uppercase tracking-widest cursor-pointer">
              Back to Home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};