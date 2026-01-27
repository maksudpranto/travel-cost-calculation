"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Menu, Map as MapIcon, Calendar, Users, Receipt, ArrowUp, ChevronRight, Edit2, Trash2, Wallet, ShieldCheck } from "lucide-react";
import { Sidebar } from '../components/Sidebar';
import { AddModal, DeleteConfirmModal } from '../components/Modals';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Trip } from '../type';
import { TripCard } from '../components/TripCard';

export default function TripsPage() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'trip' | 'profile'>('trip');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'trip', id: number } | null>(null);

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

    const handleAddTrip = () => {
        setEditingItem(null);
        setModalType('trip');
        setModalOpen(true);
    };

    const handleEditTrip = (trip: Trip) => {
        setEditingItem(trip);
        setModalType('trip');
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

    const handleSave = async (data: any) => {
        if (modalType === 'profile') {
            await authClient.updateUser({ name: data.name, image: data.image });
            setModalOpen(false);
            return;
        }

        if (editingItem) {
            const updatedTrip = { ...editingItem, ...data };
            setTrips(trips.map(t => t.id === editingItem.id ? updatedTrip : t));
            await fetch(`/api/trips/${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTrip)
            });
        } else {
            const newTrip = { id: Date.now(), ...data, currency: "BDT", people: [], expenses: [] };
            setTrips([...trips, newTrip]);
            await fetch("/api/trips", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTrip)
            });
        }
        setModalOpen(false);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const stats = useMemo(() => {
        const activeTrips = trips.filter(t => t.type !== 'bulk');
        const totalSpent = activeTrips.reduce((sum, trip) =>
            sum + (trip.expenses?.reduce((s, e) => s + (e.amount || 0), 0) || 0), 0
        );
        const totalPeople = activeTrips.reduce((sum, trip) => sum + (trip.people?.length || 0), 0);
        return { count: activeTrips.length, spent: totalSpent, people: totalPeople };
    }, [trips]);

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] gap-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-[#10B17D] rounded-full animate-spin"></div>
            <p className="text-sm font-black text-gray-400 animate-pulse uppercase tracking-widest">Loading Your Journeys</p>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-[#10B17D]/10 selection:text-[#10B17D]">
            <AddModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} onSave={handleSave} initialData={editingItem} />
            <DeleteConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} title="Delete Trip?" message="This will delete the trip and all its data." />

            <Sidebar
                trips={trips}
                activeTripId={0}
                onSelectTrip={(id) => router.push(`/dashboard?tripId=${id}`)}
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
                <div className="max-w-[1400px] mx-auto p-4 sm:p-8 md:p-12 space-y-12">

                    {/* Header Section */}
                    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-3 -ml-2 text-gray-600 hover:bg-white hover:shadow-md rounded-2xl transition-all cursor-pointer"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                    Your <span className="text-[#10B17D]">Journeys.</span>
                                </h1>
                                <p className="text-sm md:text-base text-gray-400 font-bold tracking-tight">Manage and track all your travel adventures</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddTrip}
                            className="group cursor-pointer w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#10B17D] text-white rounded-[20px] text-sm font-black hover:bg-[#0D8F65] hover:shadow-2xl hover:shadow-[#10B17D]/30 transition-all active:scale-95"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Start New Trip</span>
                        </button>
                    </header>

                    {/* Quick Stats Grid */}
                    {trips.filter(t => t.type !== 'bulk').length > 0 && (
                        <div className="flex">
                            <div className="bg-white px-8 py-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group min-w-[200px] hover:border-[#10B17D]/20">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Trips</p>
                                <p className="text-3xl font-black text-gray-900 group-hover:text-[#10B17D] transition-colors">{stats.count}</p>
                            </div>
                        </div>
                    )}

                    {trips.filter(t => t.type !== 'bulk').length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-[40px] border border-dashed border-gray-200 p-12">
                            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mb-8 border border-gray-100">
                                <MapIcon size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">No adventures yet</h3>
                            <p className="text-gray-400 font-bold mb-8 max-w-md mx-auto">Start your first journey and we'll help you track every expense and split costs effortlessly.</p>
                            <button onClick={handleAddTrip} className="cursor-pointer flex items-center gap-3 px-10 py-4 bg-[#10B17D] text-white rounded-[20px] font-black hover:bg-[#0D8F65] transition-all shadow-xl shadow-[#10B17D]/20 active:scale-95">
                                <Plus size={24} /> Create Your First Trip
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trips.filter(t => t.type !== 'bulk').map(trip => (
                                <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} onDelete={handleDeleteTrip} router={router} formatDate={formatDate} />
                            ))}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
