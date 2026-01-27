"use client";

import React from 'react';
import { Map as MapIcon, LayoutDashboard, Calculator, Settings, LogOut, X, User as UserIcon, Moon, Sun, Edit2, Trash2, ShieldCheck, ShieldAlert, ChevronDown, Lock } from 'lucide-react';
import { Trip } from '../type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAgentMode } from '../context/AgentModeContext';

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
  const { isAgentMode, toggleAgentMode } = useAgentMode();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Ongoing Trips', 'Ongoing Group Tours']);

  const isActive = (path: string, label: string) => {
    // Parent highlighting
    if (label === 'Ongoing Trips') {
      return false; // Ongoing Trips is now just a container for the list, highlighting handled by sub-items or explicit navigation
    }
    if (label === 'Ongoing Group Tours') {
      if (pathname === '/calculations') return false; // Let "All Group Tours" handle it
      return pathname === '/bulk_calculation' && (!activeTripId || activeTripId === 0);
    }

    // Exact match for other items
    return pathname === path;
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShieldCheck, label: 'All Trips', path: '/trips' },
    { icon: MapIcon, label: 'Ongoing Trips', path: '/trips' },
    ...(isAgentMode ? [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/agent_dashboard' },
      { icon: ShieldCheck, label: 'All Group Tours', path: '/calculations' },
      { icon: Calculator, label: 'Ongoing Group Tours', path: '/bulk_calculation' }
    ] : []),
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
        fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0D3D32] to-[#08241E] border-r border-white/5 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 pb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#10B17D] to-[#0D8F65] rounded-xl flex items-center justify-center shadow-lg shadow-[#10B17D]/20">
                <MapIcon className="text-white" size={24} />
              </div>
              <span className="text-xl font-black text-white tracking-tight">TravelCost</span>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:bg-white/5 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 space-y-8 sidebar-scrollbar">
            {/* Main Menu */}
            <div>
              <p className="px-4 text-[10px] font-bold text-gray-500/70 uppercase tracking-widest mb-4">Main Menu</p>
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const active = isActive(item.path, item.label);
                  const isToggleOnly = item.label === 'Ongoing Trips' || item.label === 'Ongoing Group Tours';
                  const content = (
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200
                      ${active
                        ? 'bg-gradient-to-r from-[#10B17D] to-[#0D8F65] text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}>
                      <item.icon size={20} className={active ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                  );

                  return (
                    <React.Fragment key={item.label}>
                      {isAgentMode && index === 3 && (
                        <div className="py-4 px-4 flex items-center gap-3">
                          <div className="h-[1px] flex-1 bg-white/5" />
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Agent Tools</span>
                          <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                      )}
                      <div className="flex items-center gap-1 group/item">
                        {isToggleOnly ? (
                          <div onClick={() => toggleSection(item.label)} className="flex-1">
                            {content}
                          </div>
                        ) : (
                          <Link href={item.path} onClick={onClose} className="flex-1">
                            {content}
                          </Link>
                        )}
                        {isToggleOnly && (
                          <button
                            onClick={() => toggleSection(item.label)}
                            className={`
                              p-2 mr-2 rounded-xl transition-all duration-300
                              ${expandedSections.includes(item.label) ? 'rotate-180' : 'rotate-0'}
                              text-gray-500 hover:text-white hover:bg-white/5
                            `}
                          >
                            <ChevronDown size={16} />
                          </button>
                        )}
                      </div>

                      {/* Trips Sub-items (Your Journeys) */}
                      {item.label === 'Ongoing Trips' && expandedSections.includes('Ongoing Trips') && trips.filter(t => t.type !== 'bulk' && t.status !== 'completed').length > 0 && (
                        <div className="ml-9 mt-2 mb-4 space-y-1 overflow-hidden transition-all duration-300">
                          {trips.filter(t => t.type !== 'bulk' && t.status !== 'completed').sort((a, b) => b.id - a.id).slice(0, 5).map((trip) => {
                            const isTripActive = activeTripId === trip.id;
                            return (
                              <div
                                key={trip.id}
                                className={`
                                  group flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
                                  ${isTripActive
                                    ? 'text-[#10B17D] bg-white/5'
                                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}
                                `}
                                onClick={() => { onSelectTrip(trip.id); onClose(); }}
                              >
                                <span className="truncate font-bold text-[13px]">{trip.name}</span>
                                <div className={`flex items-center gap-1 ${isTripActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onEditTrip(trip); onClose(); }}
                                    className="p-1 hover:bg-white/10 rounded-md text-gray-600 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Edit2 size={10} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip); onClose(); }}
                                    className="p-1 hover:bg-white/10 rounded-md text-gray-600 hover:text-rose-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {/* Bulk Calculations Sub-items */}
                      {item.label === 'Ongoing Group Tours' && expandedSections.includes(item.label) &&
                        trips.filter(t => t.type === 'bulk' && t.status !== 'completed').length > 0 && (
                          <div className="ml-9 mt-2 mb-4 space-y-1 overflow-hidden transition-all duration-300">
                            {trips.filter(t => t.type === 'bulk' && t.status !== 'completed').sort((a, b) => b.id - a.id).slice(0, 5).map((trip) => {
                              const isTripActive = activeTripId === trip.id;
                              return (
                                <div
                                  key={trip.id}
                                  className={`
                                  group flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
                                  ${isTripActive
                                      ? 'text-[#10B17D] bg-white/5'
                                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}
                                `}
                                  onClick={() => { onSelectTrip(trip.id); onClose(); }}
                                >
                                  <span className="truncate font-bold text-[13px]">{trip.name}</span>
                                  <div className={`flex items-center gap-1 ${isTripActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); onEditTrip(trip); onClose(); }}
                                      className="p-1 hover:bg-white/10 rounded-md text-gray-600 hover:text-white transition-colors cursor-pointer"
                                    >
                                      <Edit2 size={10} />
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip); onClose(); }}
                                      className="p-1 hover:bg-white/10 rounded-md text-gray-600 hover:text-rose-400 transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>



          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-xl">
            {/* Agent Mode Toggle */}
            <div className="mb-4 px-2">
              <button
                onClick={toggleAgentMode}
                className={`
                  w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group
                  ${isAgentMode
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-900/10'
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:bg-white/10'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-xl transition-colors duration-300
                    ${isAgentMode ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700'}
                  `}>
                    {isAgentMode ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black tracking-tight ${isAgentMode ? 'text-white' : 'text-gray-400'}`}>Agent Mode</p>
                    <p className="text-[10px] font-bold opacity-50">{isAgentMode ? 'Access unlocked' : 'Restricted access'}</p>
                  </div>
                </div>
                <div className={`
                  w-10 h-6 rounded-full relative transition-colors duration-300
                  ${isAgentMode ? 'bg-emerald-500' : 'bg-gray-700'}
                `}>
                  <div className={`
                    absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
                    ${isAgentMode ? 'left-5' : 'left-1'}
                  `} />
                </div>
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10" />
                  ) : (
                    <div className="w-10 h-10 bg-[#10B17D]/10 text-[#10B17D] rounded-xl flex items-center justify-center font-black ring-2 ring-white/10">
                      {user?.name?.charAt(0) || <UserIcon size={18} />}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#092D25] rounded-full"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white truncate">{user?.name || 'Guest User'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90 cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-all active:scale-90 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <Link href="/" className="mt-4 block text-center py-2 text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
              Back to Home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};