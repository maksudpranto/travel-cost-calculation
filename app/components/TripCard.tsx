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
        <div className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-[#10B17D]/20 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl transition-colors ${isBulk ? 'bg-emerald-50/50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-gray-50 group-hover:bg-[#10B17D]/10 group-hover:text-[#10B17D]'}`}>
                    {isBulk ? <ShieldCheck size={24} /> : <MapIcon size={24} />}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(trip)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(trip.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{trip.name}</h3>
            {isBulk ? (
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600/60 uppercase tracking-tight mb-6">
                    <ShieldCheck size={12} />
                    <span>Agent Mode Calculation</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-tight mb-6">
                    <Calendar size={12} />
                    <span>{formatDate(trip.startDate || '')} — {formatDate(trip.endDate || '')}</span>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Spent</p>
                    <p className="text-sm font-black text-gray-900">৳{totalSpent.toLocaleString()}</p>
                </div>
                {isBulk ? (
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Tourists</p>
                        <p className="text-sm font-black text-gray-900">{trip.touristCount || 0}</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">People</p>
                        <p className="text-sm font-black text-gray-900">{trip.people.length}</p>
                    </div>
                )}
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Items</p>
                    <p className="text-sm font-black text-gray-900">{trip.expenses.length}</p>
                </div>
            </div>

            <button
                onClick={() => isBulk
                    ? router.push(`/bulk_calculation?tripId=${trip.id}`)
                    : router.push(`/dashboard?tripId=${trip.id}`)
                }
                className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all active:scale-[0.98] cursor-pointer ${isBulk
                    ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                    : 'bg-gray-50 text-gray-600 group-hover:bg-[#10B17D] group-hover:text-white'}`}
            >
                {isBulk ? 'Open Calculator' : 'View Dashboard'}
                <ChevronRight size={18} />
            </button>
        </div>
    );
};
