"use client";

import React from 'react';
import { Map as MapIcon, Calendar as CalendarIcon, Edit2, Trash2, ChevronRight, ShieldCheck, Users, Receipt, Wallet, Lock, Play, PauseCircle } from "lucide-react";
import { Trip } from '../type';

interface TripListItemProps {
    trip: Trip;
    onEdit: (trip: Trip) => void;
    onDelete: (id: number) => void;
    router: any;
    formatDate: (date: string) => string;
    onToggleStatus: (trip: Trip) => void;
}

export const TripListItem = ({ trip, onEdit, onDelete, router, formatDate, onToggleStatus }: TripListItemProps) => {
    const isBulk = trip.type === 'bulk';
    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div
            onClick={() => isBulk
                ? router.push(`/bulk_calculation?tripId=${trip.id}`)
                : router.push(`/dashboard?tripId=${trip.id}`)
            }
            className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:shadow-gray-200/40 hover:border-emerald-100/50 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
        >
            {/* Icon */}
            <div className={`
                w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110
                ${isBulk ? 'bg-emerald-50 text-emerald-500' : 'bg-[#10B17D]/10 text-[#10B17D]'}
            `}>
                {isBulk ? <ShieldCheck size={24} /> : <MapIcon size={24} />}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-900 truncate group-hover:text-[#10B17D] transition-colors flex items-center gap-2">
                    {trip.status === 'completed' && <Lock size={14} className="text-amber-500 shrink-0" />}
                    {trip.name}
                </h3>
                {isBulk && (
                    <div className="flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider w-fit">
                        <ShieldCheck size={10} />
                        <span>Agent</span>
                    </div>
                )}
            </div>

            {/* Tour Date Column */}
            <div className="hidden sm:flex items-center gap-2 text-gray-400 w-40 shrink-0">
                <CalendarIcon size={14} className="text-[#10B17D]" />
                <span className="text-[12px] font-bold text-gray-600">
                    {formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}
                </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:flex items-center gap-4 sm:gap-0 bg-gray-50/50 sm:bg-transparent rounded-xl p-3 sm:p-0">
                {/* Mobile Date - Shows only on mobile since hidden on sm:flex above */}
                <div className="flex flex-col col-span-2 sm:hidden mb-2 pb-2 border-b border-gray-100">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</span>
                    <div className="flex items-center gap-1.5 text-gray-600 font-bold text-xs">
                        <CalendarIcon size={12} className="text-[#10B17D]" />
                        <span>{formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:items-end sm:w-24">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest sm:hidden mb-0.5">Spent</span>
                    <div className="flex items-center gap-1.5 font-black text-gray-900 text-sm">
                        <Wallet size={12} className="text-emerald-500 sm:hidden" />
                        <span>৳{totalSpent.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:items-end sm:w-20 border-x border-gray-100 px-4 sm:border-0 sm:px-0 ml-4 sm:ml-0">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest sm:hidden mb-0.5">{isBulk ? 'Pax' : 'Peeps'}</span>
                    <div className="flex items-center gap-1.5 font-bold text-gray-500 text-sm">
                        <Users size={12} className="sm:hidden" />
                        <span>{isBulk ? (trip.touristCount || 0) : trip.people.length}</span>
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 shrink-0 border-t border-gray-50 sm:border-0 pt-3 sm:pt-0 sm:w-[160px] sm:ml-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleStatus(trip); }}
                    className={`p-2 rounded-xl transition-all active:scale-90 cursor-pointer ${trip.status === 'completed'
                        ? 'text-emerald-500 hover:bg-emerald-50'
                        : 'text-amber-500 hover:bg-amber-50'
                        }`}
                    title={trip.status === 'completed' ? "Resume Trip" : "End Trip"}
                >
                    {trip.status === 'completed' ? <Play size={16} /> : <PauseCircle size={16} />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
                    className="p-2 text-gray-400 hover:text-[#10B17D] hover:bg-[#10B17D]/5 rounded-xl transition-all active:scale-90 cursor-pointer"
                    title="Edit Trip"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 cursor-pointer"
                    title="Delete Trip"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden sm:block" />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        isBulk ? router.push(`/bulk_calculation?tripId=${trip.id}`) : router.push(`/dashboard?tripId=${trip.id}`);
                    }}
                    className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-[#10B17D] hover:text-white group-hover:bg-[#10B17D] group-hover:text-white transition-all text-gray-400 cursor-pointer hover:shadow-lg hover:shadow-[#10B17D]/20 active:scale-90"
                    title="View Details"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
