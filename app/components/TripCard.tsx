"use client";

import React from 'react';
import { Map as MapIcon, Calendar, Edit2, Trash2, ChevronRight, ShieldCheck } from "lucide-react";
import { Trip } from '../type';

interface TripCardProps {
    trip: Trip;
    onEdit: (trip: Trip) => void;
    onDelete: (id: number) => void;
    router: any;
    formatDate: (date: string) => string;
}

export const TripCard = ({ trip, onEdit, onDelete, router, formatDate }: TripCardProps) => {
    const isBulk = trip.type === 'bulk';
    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="group relative bg-white rounded-[32px] border border-gray-100 p-1 shadow-sm hover:shadow-2xl hover:shadow-[#10B17D]/10 hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden">
            {/* Background Gradient Element */}
            <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isBulk ? 'bg-emerald-500' : 'bg-[#10B17D]'}`} />

            <div className="p-5 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`
                        p-4 rounded-2xl transition-all duration-500 
                        ${isBulk
                            ? 'bg-emerald-50 text-emerald-500 group-hover:scale-110 group-hover:rotate-3'
                            : 'bg-[#10B17D]/10 text-[#10B17D] group-hover:scale-110 group-hover:rotate-3'}
                    `}>
                        {isBulk ? <ShieldCheck size={28} strokeWidth={2.5} /> : <MapIcon size={28} strokeWidth={2.5} />}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#10B17D] hover:bg-[#10B17D]/10 rounded-xl transition-all duration-300 active:scale-90 cursor-pointer"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 active:scale-90 cursor-pointer"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-[#10B17D] transition-colors">
                        {trip.name}
                    </h3>
                    {isBulk ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit">
                            <ShieldCheck size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Agent Calculation</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar size={14} />
                            <span className="text-xs font-bold leading-none">{formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/50 rounded-2xl mb-6 group-hover:bg-white transition-colors duration-500 border border-transparent group-hover:border-gray-100">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Spent</span>
                        <span className="text-sm font-black text-gray-900 group-hover:text-[#10B17D] transition-colors">৳{totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-x border-gray-100 px-3">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{isBulk ? 'Tourists' : 'People'}</span>
                        <span className="text-sm font-black text-gray-900">{isBulk ? (trip.touristCount || 0) : trip.people.length}</span>
                    </div>
                    <div className="flex flex-col gap-1 pl-3">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Items</span>
                        <span className="text-sm font-black text-gray-900">{trip.expenses.length}</span>
                    </div>
                </div>

                <button
                    onClick={() => isBulk
                        ? router.push(`/bulk_calculation?tripId=${trip.id}`)
                        : router.push(`/dashboard?tripId=${trip.id}`)
                    }
                    className={`
                        mt-auto group/btn flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all duration-300 active:scale-95 cursor-pointer
                        ${isBulk
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600'
                            : 'bg-white text-[#10B17D] border-2 border-[#10B17D]/10 hover:bg-[#10B17D] hover:text-white hover:border-[#10B17D] hover:shadow-xl hover:shadow-[#10B17D]/20'}
                    `}
                >
                    <span>{isBulk ? 'Open Calculator' : 'View Analytics'}</span>
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
