"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    Coins,
    ShieldCheck,
    Menu,
    ShieldAlert,
    ArrowRight,
    Calculator,
    TrendingDown,
    TrendingUp,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/Sidebar';
import { Trip } from '../type';
import { useAgentMode } from '../context/AgentModeContext';
import { AddModal } from '../components/Modals';
import Link from 'next/link';

export default function AgentDashboard() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const { isAgentMode, setAgentMode } = useAgentMode();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all trips to filter bulk ones
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
        if (session?.user) {
            fetchTrips();
        } else {
            setIsLoading(false);
        }
    }, [session]);

    const bulkTours = useMemo(() => trips.filter(t => t.type === 'bulk' && t.status === 'completed'), [trips]);

    const stats = useMemo(() => {
        const totalTours = bulkTours.length;
        let totalSpend = 0;
        let totalCollection = 0;

        bulkTours.forEach(tour => {
            const tourSpend = tour.expenses.reduce((sum, e) => sum + e.amount, 0);
            const tourCollection = (tour.touristCount || 0) * (tour.feePerPerson || 0);
            totalSpend += tourSpend;
            totalCollection += tourCollection;
        });

        const totalProfit = totalCollection - totalSpend;

        return {
            totalTours,
            totalSpend,
            totalProfit,
            avgProfitPerTour: totalTours > 0 ? totalProfit / totalTours : 0
        };
    }, [bulkTours]);

    const handleEditProfile = () => {
        // This could be implemented or handled by a common modal
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/")
            }
        });
    };

    const handleCreateBulkTour = async (data: { name: string, touristCount: number, feePerPerson: number }) => {
        try {
            const res = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    type: 'bulk',
                    touristCount: data.touristCount,
                    feePerPerson: data.feePerPerson,
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
    };

    const StatCard = ({ label, value, icon: Icon, color, subValue }: { label: string; value: string; icon: any; color: 'blue' | 'rose' | 'emerald' | 'purple', subValue?: string }) => {
        const colorMap = {
            blue: 'from-blue-500 to-blue-600 shadow-blue-200',
            rose: 'from-rose-500 to-rose-600 shadow-rose-200',
            emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
            purple: 'from-purple-500 to-indigo-600 shadow-indigo-200',
        };

        return (
            <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all duration-300 group text-white border border-white/10`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black leading-none tracking-tight">{value}</span>
                        {subValue && <span className="text-[10px] font-bold text-white/60">{subValue}</span>}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Agency Data...</div>;

    if (!isAgentMode) {
        return (
            <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-gray-900 overflow-x-hidden">
                <Sidebar
                    trips={trips}
                    activeTripId={0}
                    onSelectTrip={(id) => router.push(`/dashboard?tripId=${id}`)}
                    onEditTrip={() => { }}
                    onDeleteTrip={() => { }}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    user={session?.user}
                    onLogout={handleLogout}
                />
                <main className="md:ml-80 flex-1 min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center gap-8 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10B17D]/5 rounded-full blur-3xl" />
                        <div className="w-24 h-24 bg-gradient-to-br from-[#10B17D] to-[#0D8F65] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-[#10B17D]/20">
                            <ShieldCheck size={48} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agent Mode Required</h2>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                The Agency Dashboard is restricted to travel agents. Enable Agent Mode to unlock this feature.
                            </p>
                        </div>
                        <button
                            onClick={() => setAgentMode(true)}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-[#10B17D] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                        >
                            <span>Activate Agent Mode</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-gray-900 overflow-x-hidden">
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
                onEditTrip={() => { }}
                onDeleteTrip={() => { }}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={session?.user}
                onLogout={handleLogout}
            />

            <main className="md:ml-80 flex-1 min-w-0">
                <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 space-y-10">

                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                    <LayoutDashboard className="text-[#10B17D] shrink-0" size={28} />
                                    <span>Agency Overview</span>
                                </h1>
                                <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">
                                    Consolidated statistics for all your bulk tour calculations
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#10B17D] text-white rounded-2xl text-sm font-bold hover:bg-[#0D8F65] shadow-lg shadow-[#10B17D]/20 transition-all active:scale-95 cursor-pointer"
                            >
                                <Calculator size={18} />
                                <span>New Calculation</span>
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Bulk Tours"
                            value={stats.totalTours.toString()}
                            icon={Calculator}
                            color="blue"
                        />
                        <StatCard
                            label="Total Spent"
                            value={`৳${stats.totalSpend.toLocaleString()}`}
                            icon={Receipt}
                            color="rose"
                        />
                        <StatCard
                            label="Total Net Profit"
                            value={`৳${stats.totalProfit.toLocaleString()}`}
                            icon={Coins}
                            color={stats.totalProfit >= 0 ? "emerald" : "rose"}
                        />
                        <StatCard
                            label="Avg Profit / Tour"
                            value={`৳${Math.round(stats.avgProfitPerTour).toLocaleString()}`}
                            icon={LayoutDashboard}
                            color="purple"
                        />
                    </div>

                    {/* Recent Tours List */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Clock className="text-[#10B17D]" size={22} />
                                Recent Bulk Tours
                            </h3>
                            <Link
                                href="/calculations"
                                className="text-xs font-bold text-[#10B17D] hover:text-[#0D8F65] transition-colors flex items-center gap-1 group"
                            >
                                View all Tours
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tour Name</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Tourists</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Spend</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Profit</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bulkTours.slice(0, 5).map((tour) => {
                                        const tourSpend = tour.expenses.reduce((sum, e) => sum + e.amount, 0);
                                        const tourCollection = (tour.touristCount || 0) * (tour.feePerPerson || 0);
                                        const tourProfit = tourCollection - tourSpend;

                                        return (
                                            <tr key={tour.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5 font-bold text-gray-900">{tour.name}</td>
                                                <td className="py-5 text-gray-600 font-medium text-center">{tour.touristCount || 0}</td>
                                                <td className="py-5 text-gray-600 font-bold text-right">৳{tourSpend.toLocaleString()}</td>
                                                <td className={`py-5 font-black text-right ${tourProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    <div className="flex items-center justify-end gap-1">
                                                        {tourProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                        ৳{tourProfit.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-5 text-right">
                                                    <Link
                                                        href={`/bulk_calculation?tripId=${tour.id}`}
                                                        className="p-2 text-gray-300 hover:text-[#10B17D] hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all inline-flex"
                                                    >
                                                        <ArrowRight size={18} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {bulkTours.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-200">
                                                        <Calculator size={40} />
                                                    </div>
                                                    <p className="text-gray-400 font-medium">No bulk tours found. Start by creating a new calculation.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <AddModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="bulk_trip"
                onSave={handleCreateBulkTour}
            />
        </div>
    );
}
