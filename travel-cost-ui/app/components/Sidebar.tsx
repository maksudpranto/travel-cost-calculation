// app/components/Sidebar.tsx
import React from 'react';
import { Map, Globe, Pencil, Trash2 } from "lucide-react";
import { Trip } from '../types';

export const Sidebar = ({
  trips,
  activeTripId,
  onSelectTrip,
  onEditTrip,
  onDeleteTrip
}: {
  trips: Trip[],
  activeTripId: number,
  onSelectTrip: (id: number) => void,
  onEditTrip: (trip: Trip) => void,
  onDeleteTrip: (trip: Trip) => void
}) => (
  <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-y-auto hidden md:flex z-10">
    <div className="p-6 pb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <Globe size={18} />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Travello by Pranto</h1>
      </div>
      <p className="text-xs text-gray-400 pl-11">Multi-trip manager</p>
    </div>
    <nav className="flex-1 px-4 space-y-6 mt-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Your Trips</h3>
        <ul className="space-y-1">
          {trips.map(trip => (
            <li key={trip.id} className="group relative">
              <button
                onClick={() => onSelectTrip(trip.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition pr-16 ${
                  activeTripId === trip.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Map size={16} className={activeTripId === trip.id ? 'text-blue-600' : 'text-gray-400'} />
                <span className="truncate">{trip.name}</span>
              </button>

              <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 ${activeTripId === trip.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button
                  onClick={(e) => { e.stopPropagation(); onEditTrip(trip); }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md"
                  title="Edit Trip Name"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip); }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md"
                  title="Delete Trip"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
    <div className="p-6 border-t border-gray-50">
      <p className="text-xs text-gray-300">v0.3 Beta</p>
    </div>
  </aside>
);