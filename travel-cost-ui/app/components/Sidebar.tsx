import React from 'react';
import { Map, Edit2, Trash2, LogOut, User as UserIcon } from 'lucide-react';
import { Trip } from '../types';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

interface SidebarProps {
  trips: Trip[];
  activeTripId: number;
  onSelectTrip: (id: number) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ trips, activeTripId, onSelectTrip, onEditTrip, onDeleteTrip, isOpen, onClose }: SidebarProps) => {
  const { currentUser, logout } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        <div className="p-6 flex items-center gap-3 border-b border-gray-50">
          <div className="w-10 h-10 bg-[#41644A] rounded-xl flex items-center justify-center shadow-sm">
            <Map className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Trip Manager</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Your Trips</div>

          {trips.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8 italic">
              No trips yet.
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => { onSelectTrip(trip.id); onClose(); }}
                className={`
                  group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${activeTripId === trip.id
                    ? 'bg-[#41644A]/10 text-[#41644A] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <div className="truncate flex-1 pr-2">
                  {trip.name}
                </div>

                <div className={`flex items-center gap-1 ${activeTripId === trip.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditTrip(trip); }}
                    className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip); }}
                    className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- PROFILE FOOTER --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm relative group">

              <Link href="/profile" className="flex flex-1 items-center gap-3 min-w-0 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41644A] to-[#2e4a34] flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                   {currentUser?.profilePicture ? (
                     <img src={currentUser.profilePicture} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon size={18} />
                   )}
                </div>

                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#41644A] transition-colors">
                      {currentUser?.username || 'User'}
                   </p>
                   <p className="text-[10px] text-gray-500 truncate font-medium">
                      {currentUser?.contact || 'Guest'}
                   </p>
                </div>
              </Link>

              {/* UPDATED LOGOUT BUTTON: Added explicit cursor-pointer and hover background */}
              <button
                onClick={(e) => { e.stopPropagation(); logout(); }}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors z-10 cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
           </div>
        </div>

      </aside>
    </>
  );
};