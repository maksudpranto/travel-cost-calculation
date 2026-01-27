"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Menu, LayoutDashboard, ShieldCheck, ChevronRight, Edit2, Trash2, TrendingUp, TrendingDown, ArrowRight, Clock, Lock, Copy, Unlock } from "lucide-react";
import { Sidebar } from '../components/Sidebar';
import { AddModal, DeleteConfirmModal, ConfirmModal } from '../components/Modals';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trip } from '../type';

export default function CalculationsPage() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'trip' | 'profile' | 'bulk_trip'>('trip');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'trip', id: number } | null>(null);
    const [toggleModalOpen, setToggleModalOpen] = useState(false);
    const [tripToToggle, setTripToToggle] = useState<Trip | null>(null);

    const fetchTrips = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/trips");
            if (res.ok) {
                const data = await res.json();
                setTrips(data);
            }
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) fetchTrips();
        else if (!isLoading) setIsLoading(false);
    }, [session]);


    const handleEditTrip = (trip: Trip) => {
        setEditingItem(trip);
        setModalType(trip.type === 'bulk' ? 'bulk_trip' : 'trip');
        setModalOpen(true);
    };

    const handleDeleteTrip = (id: number) => {
        setItemToDelete({ type: 'trip', id });
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setTrips(trips.filter(t => t.id !== itemToDelete.id));
        await fetch(`/api/trips/${itemToDelete.id}`, { method: 'DELETE' });
        setItemToDelete(null);
    };

    const handleToggleStatus = (trip: Trip) => {
        setTripToToggle(trip);
        setToggleModalOpen(true);
    };

    const confirmToggleStatus = async () => {
        if (!tripToToggle) return;
        const newStatus: 'active' | 'completed' = tripToToggle.status === 'completed' ? 'active' : 'completed';
        const updatedTrip = { ...tripToToggle, status: newStatus };

        // Optimistic Update
        setTrips(trips.map(t => t.id === tripToToggle.id ? updatedTrip : t));
        setToggleModalOpen(false);

        // API Update
        await fetch(`/api/trips/${tripToToggle.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTrip)
        });
        setTripToToggle(null);
    };

    const handleSave = async (data: any) => {
        if (modalType === 'profile') {
            await authClient.updateUser({ name: data.name, image: data.image });
            setModalOpen(false);
            return;
        }

        if (modalType === 'bulk_trip') {
            try {
                const res = await fetch("/api/trips", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: data.name,
                        type: 'bulk',
                        touristCount: data.touristCount,
                        feePerPerson: data.feePerPerson,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        status: 'active',
                        expenses: []
                    }),
                });

                if (res.ok) {
                    const newTrip = await res.json();
                    router.push(`/bulk_calculation?tripId=${newTrip.id}`);
                }
            } catch (error) {
                console.error("Failed to create bulk tour", error);
            }
            setModalOpen(false);
            return;
        }

        if (editingItem) {
            const updatedTrip = { ...editingItem, name: data.name, startDate: data.startDate, endDate: data.endDate };
            const payload = modalType === 'trip' ? { name: data.name, startDate: data.startDate, endDate: data.endDate } : data;
            setTrips(trips.map(t => t.id === editingItem.id ? updatedTrip : t));
            await fetch(`/api/trips/${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleCloneTrip = async (trip: Trip) => {
        const newTrip = {
            ...trip,
            id: Date.now(),
            name: `${trip.name} (Copy)`,
            status: 'active' as 'active' | 'completed',
            expenses: trip.expenses.map(e => ({ ...e }))
        };

        // Optimistic Update
        setTrips([...trips, newTrip]);

        // API Create
        await fetch("/api/trips", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTrip)
        });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const bulkTrips = trips.filter(t => t.type === 'bulk');


    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-gray-900">
            <AddModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} type={modalType} onSave={handleSave} initialData={editingItem} />
            <DeleteConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} title="Delete Calculation?" message="This will permanently remove this saved calculation." />
            <ConfirmModal
                isOpen={toggleModalOpen}
                onClose={() => setToggleModalOpen(false)}
                onConfirm={confirmToggleStatus}
                title={tripToToggle?.status === 'completed' ? "Resume Calculation?" : "End Calculation?"}
                message={tripToToggle?.status === 'completed'
                    ? "This will reopen the calculation for modifications."
                    : "This will mark the calculation as completed."}
                confirmText={tripToToggle?.status === 'completed' ? "Resume" : "Complete"}
                variant={tripToToggle?.status === 'completed' ? 'success' : 'warning'}
            />

            <Sidebar
                trips={trips}
                activeTripId={0}
                onSelectTrip={(id) => {
                    const trip = trips.find(t => t.id === id);
                    if (trip?.type === 'bulk') {
                        router.push(`/bulk_calculation?tripId=${id}`);
                    } else {
                        router.push(`/dashboard?tripId=${id}`);
                    }
                }}
                onEditTrip={handleEditTrip}
                onDeleteTrip={(trip) => handleDeleteTrip(trip.id)}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={session?.user}
                onEditProfile={() => {
                    setEditingItem({ name: session?.user?.name, image: session?.user?.image });
                    setModalType('profile');
                    setModalOpen(true);
                }}
                onLogout={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
            />

            <main className="md:ml-80 flex-1 min-w-0">
                <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 space-y-8 md:space-y-10">

                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Saved Calculations</h1>
                                <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">Manage all your agent mode budget plans</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setModalType('bulk_trip');
                                setModalOpen(true);
                            }}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#10B17D] text-white rounded-xl text-sm font-bold hover:bg-[#0D8F65] hover:shadow-lg shadow-[#10B17D]/20 transition-all active:scale-95"
                        >
                            <Plus size={18} />
                            <span>New Calculation</span>
                        </button>
                    </header>

                    {bulkTrips.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                                <ShieldCheck size={32} className="md:size-[40px]" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No calculations found</h3>
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setModalType('bulk_trip');
                                    setModalOpen(true);
                                }}
                                className="cursor-pointer flex items-center gap-2 px-8 py-3 bg-[#10B17D] text-white rounded-xl font-bold hover:bg-[#0D8F65] transition-all"
                            >
                                <Plus size={20} /> Create Your First Calculation
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-50">
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tour Name</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tour Date</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tourists</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Spend</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Profit</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {bulkTrips.map((tour) => {
                                            const tourSpend = tour.expenses.reduce((sum, e) => sum + e.amount, 0);
                                            const tourCollection = (tour.touristCount || 0) * (tour.feePerPerson || 0);
                                            const tourProfit = tourCollection - tourSpend;

                                            return (
                                                <tr key={tour.id} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-5">
                                                        <div className="flex items-center gap-2">
                                                            {tour.status === 'completed' && <Lock size={14} className="text-amber-500 shrink-0" />}
                                                            <span className="font-bold text-gray-900">{tour.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 text-[11px] font-bold text-gray-500 whitespace-nowrap">
                                                        {formatDate(tour.startDate || '')} — {formatDate(tour.endDate || '')}
                                                    </td>
                                                    <td className="py-5 text-gray-600 font-medium text-center">{tour.touristCount || 0}</td>
                                                    <td className="py-5 text-gray-600 font-bold text-right">৳{tourSpend.toLocaleString()}</td>
                                                    <td className={`py-5 font-black text-right ${tourProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        <div className="flex items-center justify-end gap-1">
                                                            {tourProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                            ৳{tourProfit.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(tour); }}
                                                                className={`p-2 rounded-xl transition-all active:scale-90 cursor-pointer ${tour.status === 'completed' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                                                                title={tour.status === 'completed' ? "Resume Calculation" : "End Calculation"}
                                                            >
                                                                {tour.status === 'completed' ? <Unlock size={16} /> : <Lock size={16} />}
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleEditTrip(tour); }}
                                                                className="p-2 text-gray-300 hover:text-[#10B17D] hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all inline-flex"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteTrip(tour.id); }}
                                                                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all inline-flex"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleCloneTrip(tour); }}
                                                                className="p-2 text-gray-300 hover:text-blue-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all inline-flex"
                                                                title="Clone Calculation"
                                                            >
                                                                <Copy size={16} />
                                                            </button>
                                                            <Link
                                                                href={`/bulk_calculation?tripId=${tour.id}`}
                                                                className="p-2 text-gray-300 hover:text-[#10B17D] hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all inline-flex"
                                                            >
                                                                <ArrowRight size={18} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
