"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Menu, LayoutDashboard, ShieldCheck, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Sidebar } from '../components/Sidebar';
import { AddModal, DeleteConfirmModal } from '../components/Modals';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Trip } from '../type';
import { TripCard } from '../components/TripCard';

export default function CalculationsPage() {
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
            const updatedTrip = { ...editingItem, name: data.name };
            setTrips(trips.map(t => t.id === editingItem.id ? updatedTrip : t));
            await fetch(`/api/trips/${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.name })
            });
        }
        setModalOpen(false);
        setEditingItem(null);
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
                            onClick={() => router.push('/bulk_calculation')}
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
                            <button onClick={() => router.push('/bulk_calculation')} className="cursor-pointer flex items-center gap-2 px-8 py-3 bg-[#10B17D] text-white rounded-xl font-bold hover:bg-[#0D8F65] transition-all">
                                <Plus size={20} /> Create Your First Calculation
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bulkTrips.map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onEdit={handleEditTrip}
                                    onDelete={handleDeleteTrip}
                                    router={router}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
