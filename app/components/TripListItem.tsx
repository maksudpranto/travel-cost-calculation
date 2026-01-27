"use client";

import React from 'react';
import { Map as MapIcon, Calendar as CalendarIcon, Edit2, Trash2, ChevronRight, ShieldCheck, Users, Receipt, Wallet, Lock } from "lucide-react";
import { Trip } from '../type';

interface TripListItemProps {
    trip: Trip;
    onEdit: (trip: Trip) => void;
    onDelete: (id: number) => void;
    router: any;
    formatDate: (date: string) => string;
}

export const TripListItem = ({ trip, onEdit, onDelete, router, formatDate }: TripListItemProps) => {
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
                <div className="flex items-center gap-3 mt-1">
                    {isBulk && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <ShieldCheck size={10} />
                            <span>Agent</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <CalendarIcon size={12} />
                        <span className="text-[11px] font-bold">{formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:flex items-center gap-4 sm:gap-0 bg-gray-50/50 sm:bg-transparent rounded-xl p-3 sm:p-0">
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
            <div className="flex items-center justify-end gap-2 shrink-0 border-t border-gray-50 sm:border-0 pt-3 sm:pt-0 sm:w-[140px] sm:ml-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
                    className="p-2 text-gray-400 hover:text-[#10B17D] hover:bg-[#10B17D]/5 rounded-xl transition-all active:scale-90 cursor-pointer"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 cursor-pointer"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden sm:block" />
                <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#10B17D] group-hover:text-white transition-all text-gray-400">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
