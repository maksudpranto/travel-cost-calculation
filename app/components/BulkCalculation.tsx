"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Ticket,
  Plus,
  Trash2,
  Wallet,
  TrendingDown,
  ArrowLeft,
  Calculator,
  Pencil,
  Check,
  X,
  Menu,
  Receipt,
  Coins,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { AddModal, DeleteConfirmModal } from './Modals';
import { Trip } from '../type';
import { useAgentMode } from '../context/AgentModeContext';

export default function BulkCalculation() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAgentMode, setAgentMode } = useAgentMode();

  // --- TRIP SELECTION STATE ---
  const [currentTripId, setCurrentTripId] = useState<number | null>(null);
  const [activeTripName, setActiveTripName] = useState<string>("New Calculation");
  const [isSaving, setIsSaving] = useState(false);

  // --- APP STATE (For Sidebar & Navigation) ---
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'profile' | 'trip'>('profile');
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'expense' | 'trip', id: number } | null>(null);

  // --- FETCH TRIPS FOR SIDEBAR & SELECTION ---
  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (error) {
      console.error("Failed to fetch trips", error);
    }
  };

  useEffect(() => {
    if (session?.user) fetchTrips();
  }, [session]);

  const handleEditProfile = () => {
    setModalType('profile');
    setModalOpen(true);
  };

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/")
      }
    });
  };

  // --- CORE CALCULATOR STATE ---
  const [touristCount, setTouristCount] = useState<number | ''>('');
  const [feePerPerson, setFeePerPerson] = useState<number | ''>('');
  const [expenses, setExpenses] = useState<{ id: number; item: string; amount: number }[]>([]);

  // --- FORM STATE ---
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // --- EDIT & DELETE STATE ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE & LOADING ---
  useEffect(() => {
    const tripId = searchParams.get('tripId');

    if (tripId && trips.length > 0) {
      const selected = trips.find(t => t.id === parseInt(tripId));
      if (selected && selected.type === 'bulk') {
        setCurrentTripId(selected.id);
        setActiveTripName(selected.name);
        setTouristCount(selected.touristCount ?? '');
        setFeePerPerson(selected.feePerPerson ?? '');
        setExpenses(selected.expenses.map(e => ({ id: e.id, item: e.item, amount: e.amount })));
      }
    } else if (!tripId && !isLoaded) {
      const saved = localStorage.getItem('bulk_calc_data');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setTouristCount(data.touristCount ?? '');
          setFeePerPerson(data.feePerPerson ?? '');
          setExpenses(data.expenses || []);
        } catch (e) {
          console.error("Failed to load local data", e);
        }
      }
    }
    setIsLoaded(true);
  }, [searchParams, trips, isLoaded]);

  // Persist to localStorage for "New Calculations" only
  useEffect(() => {
    if (isLoaded && !currentTripId) {
      const dataToSave = { touristCount, feePerPerson, expenses };
      localStorage.setItem('bulk_calc_data', JSON.stringify(dataToSave));
    }
  }, [touristCount, feePerPerson, expenses, isLoaded, currentTripId]);

  // --- HANDLERS ---

  const handleNewCalculation = () => {
    setCurrentTripId(null);
    setActiveTripName("New Calculation");
    setTouristCount('');
    setFeePerPerson('');
    setExpenses([]);
    router.push('/bulk_calculation');
  };

  const handleSaveClick = () => {
    if (currentTripId) {
      updateSavedTrip();
    } else {
      setModalType('trip');
      setModalOpen(true);
    }
  };

  const updateSavedTrip = async () => {
    if (!currentTripId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/trips/${currentTripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeTripName,
          type: 'bulk',
          touristCount,
          feePerPerson,
          expenses
        })
      });
      if (res.ok) {
        fetchTrips();
      }
    } catch (e) {
      console.error("Failed to update trip", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTrip = async (data: { name: string }) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          type: 'bulk',
          touristCount,
          feePerPerson,
          expenses: expenses.map(e => ({ id: e.id, item: e.item, amount: e.amount }))
        }),
      });

      if (res.ok) {
        const newTrip = await res.json();
        setCurrentTripId(newTrip.id);
        setActiveTripName(newTrip.name);
        setModalOpen(false);
        fetchTrips();
        router.push(`/bulk_calculation?tripId=${newTrip.id}`);
      }
    } catch (error) {
      console.error("Failed to save trip", error);
    } finally {
      setIsSaving(false);
    }
  };
  const stats = useMemo(() => {
    const safeCount = Number(touristCount) || 0;
    const safeFee = Number(feePerPerson) || 0;

    const totalCollection = safeCount * safeFee;
    const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalCollection - totalCost;
    const avgCostPerHead = safeCount > 0 ? totalCost / safeCount : 0;

    const percentUsed = totalCollection > 0 ? (totalCost / totalCollection) * 100 : 0;

    return { totalCollection, totalCost, remaining, avgCostPerHead, percentUsed, safeCount, safeFee };
  }, [touristCount, feePerPerson, expenses]);

  // --- HANDLERS ---

  // 1. Add OR Update Expense
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem) {
      setError("Please enter an item name");
      return;
    }

    const amountVal = parseFloat(newAmount);
    if (!newAmount || isNaN(amountVal) || amountVal <= 0) {
      setError("Please enter a valid amount (> 0)");
      return;
    }

    setError(null);

    if (editingId) {
      setExpenses(expenses.map(e =>
        e.id === editingId ? { ...e, item: newItem, amount: amountVal } : e
      ));
      setEditingId(null);
    } else {
      setExpenses([...expenses, { id: Date.now(), item: newItem, amount: amountVal }]);
    }

    setNewItem("");
    setNewAmount("");
  };

  // 2. Start Edit Mode
  const startEdit = (expense: { id: number; item: string; amount: number }) => {
    setNewItem(expense.item);
    setNewAmount(expense.amount.toString());
    setEditingId(expense.id);
  };

  // 3. Cancel Edit Mode
  const cancelEdit = () => {
    setNewItem("");
    setNewAmount("");
    setEditingId(null);
  }

  // 4. Delete Logic
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'expense') {
      setExpenses(expenses.filter(e => e.id !== itemToDelete.id));
      if (editingId === itemToDelete.id) cancelEdit();
    } else if (itemToDelete.type === 'trip') {
      // Remote Delete
      await fetch(`/api/trips/${itemToDelete.id}`, { method: 'DELETE' });
      fetchTrips();
      // If we deleted the current trip, clear state or redirect
      if (currentTripId === itemToDelete.id) {
        handleNewCalculation();
        router.push('/bulk_calculation');
      }
    }
    setItemToDelete(null);
  };

  // --- HELPER COMPONENTS ---
  const StatItem = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600 shadow-blue-200',
      rose: 'from-rose-500 to-rose-600 shadow-rose-200',
      emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
      purple: 'from-purple-500 to-indigo-600 shadow-indigo-200',
    };

    return (
      <div className={`bg-gradient-to-br ${colorMap[color] || 'from-gray-500 to-gray-600'} p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-300 group text-white border border-white/10`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20">
            <Icon size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-black leading-none tracking-tight">৳{value}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-gray-900 overflow-x-hidden">
      {/* Modals & Sidebar */}
      <AddModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTrip(null); }}
        type={modalType}
        onSave={async (data) => {
          if (modalType === 'profile') {
            await authClient.updateUser({ name: data.name, image: data.image });
            setModalOpen(false);
          } else if (modalType === 'trip') {
            if (editingTrip) {
              // Rename Existing Trip
              await fetch(`/api/trips/${editingTrip.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.name })
              });
              if (currentTripId === editingTrip.id) setActiveTripName(data.name);
              fetchTrips();
            } else {
              await handleAddTrip(data);
            }
          }
        }}
        initialData={editingTrip ? { name: editingTrip.name } : (modalType === 'profile' ? { name: session?.user?.name, image: session?.user?.image } : undefined)}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={itemToDelete?.type === 'trip' ? "Delete Calculation?" : "Delete Expense?"}
        message={itemToDelete?.type === 'trip' ? "This will permanently remove this saved calculation." : "Are you sure you want to remove this expense?"}
      />

      <Sidebar
        trips={trips}
        activeTripId={currentTripId || 0}
        onSelectTrip={(id) => {
          const trip = trips.find(t => t.id === id);
          if (trip?.type === 'bulk') {
            router.push(`/bulk_calculation?tripId=${id}`);
          } else {
            router.push(`/dashboard?tripId=${id}`);
          }
        }}
        onEditTrip={(trip) => {
          setEditingTrip(trip);
          setModalType('trip');
          setModalOpen(true);
        }}
        onDeleteTrip={(trip) => {
          setItemToDelete({ type: 'trip', id: trip.id });
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={session?.user}
        onEditProfile={handleEditProfile}
        onLogout={handleLogout}
      />

      <main className="md:ml-80 flex-1 min-w-0">
        {!isAgentMode ? (
          <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden absolute top-6 left-6 p-3 bg-white text-gray-600 rounded-2xl shadow-xl border border-gray-100/50 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer z-10"
            >
              <Menu size={24} />
            </button>

            <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center gap-8 relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10B17D]/5 rounded-full blur-3xl group-hover:bg-[#10B17D]/10 transition-colors duration-500" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl" />

              <div className="w-24 h-24 bg-gradient-to-br from-[#10B17D] to-[#0D8F65] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-[#10B17D]/20 animate-bounce-slow">
                <ShieldCheck size={48} strokeWidth={1.5} />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Agent Mode Required</h2>
                <p className="text-gray-400 font-medium leading-relaxed">
                  The Calculator is an advanced tool restricted to travel agents. Enable Agent Mode to unlock this feature.
                </p>
              </div>

              <button
                onClick={() => setAgentMode(true)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-[#10B17D] shadow-xl hover:shadow-[#10B17D]/20 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Activate Agent Mode</span>
                <ArrowLeft className="rotate-180" size={18} />
              </button>

              <Link href="/dashboard" className="text-xs font-bold text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-widest">
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 space-y-8">

            {/* HEADER */}
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
                    <Calculator className="text-[#10B17D] shrink-0" size={28} />
                    <span className="truncate">{activeTripName}</span>
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">
                    {currentTripId ? 'Editing saved calculation' : 'Quick budget planning for any trip'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => router.push('/calculations')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>View All</span>
                </button>
                <button
                  onClick={handleNewCalculation}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 border border-blue-100/50 rounded-xl text-xs font-bold hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>New</span>
                </button>
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${isSaving ? 'bg-gray-400' : 'bg-[#10B17D] hover:bg-[#0D8F65] shadow-[#10B17D]/20'}`}
                >
                  <ShieldCheck size={16} />
                  <span>{currentTripId ? 'Save Changes' : 'Save As Trip'}</span>
                </button>
              </div>
            </header>

            {/* TOP SUMMARY ROW - Matching Dashboard Grid Cols */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatItem
                label="Total Collection"
                value={stats.totalCollection.toLocaleString()}
                icon={Wallet}
                color="blue"
              />
              <StatItem
                label="Total Spent"
                value={stats.totalCost.toLocaleString()}
                icon={Receipt}
                color="rose"
              />
              <StatItem
                label="Remaining Fund"
                value={stats.remaining.toLocaleString()}
                icon={Coins}
                color={stats.remaining >= 0 ? "emerald" : "rose"}
              />
              <StatItem
                label="Cost Per Head"
                value={Math.round(stats.avgCostPerHead).toLocaleString()}
                icon={Users}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* LEFT COLUMN: Inputs */}
              <div className="xl:col-span-2 space-y-8">

                {/* Tour Configuration */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Users className="text-[#10B17D]" size={20} />
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Tourists</label>
                      <div className="relative group">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B17D] transition-colors" size={18} />
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={touristCount}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTouristCount(val === '' ? '' : Math.max(0, parseInt(val)));
                            if (error) setError(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#10B17D]/20 focus:border-[#10B17D] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fee Per Person</label>
                      <div className="relative group">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B17D] transition-colors" size={18} />
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={feePerPerson}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFeePerPerson(val === '' ? '' : Math.max(0, parseFloat(val)));
                            if (error) setError(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#10B17D]/20 focus:border-[#10B17D] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add/Edit Expense Form */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Receipt className="text-rose-500" size={20} />
                      {editingId ? 'Edit Expense' : 'Estimate Expense'}
                    </h3>
                    {editingId && (
                      <button onClick={cancelEdit} className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">Cancel Edit</button>
                    )}
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                      <X size={14} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleExpenseSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="e.g. Bus Fare, Hotel, Meal"
                        value={newItem}
                        onChange={(e) => {
                          setNewItem(e.target.value);
                          if (error) setError(null);
                        }}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#10B17D] focus:ring-2 focus:ring-[#10B17D]/20 transition-all font-medium"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full md:w-40 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Cost"
                          value={newAmount}
                          onChange={(e) => {
                            setNewAmount(e.target.value);
                            if (error) setError(null);
                          }}
                          className="w-full pl-8 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#10B17D] focus:ring-2 focus:ring-[#10B17D]/20 transition-all font-bold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="p-3 bg-[#10B17D] text-white rounded-xl hover:bg-[#0D8F65] shadow-lg shadow-[#10B17D]/20 transition-all active:scale-95 flex items-center justify-center min-w-[52px]"
                      >
                        {editingId ? <Check size={24} /> : <Plus size={24} />}
                      </button>
                    </div>
                  </form>
                </div>

                {/* PROGRESS VIEW FOR BUDGET */}
                {stats.totalCollection > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Budget Utilization</span>
                      <span className={`text-sm font-black ${stats.percentUsed > 100 ? 'text-rose-600' : 'text-[#10B17D]'}`}>
                        {Math.round(stats.percentUsed)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${stats.percentUsed > 100 ? 'bg-rose-500' : 'bg-[#10B17D]'}`}
                        style={{ width: `${Math.min(stats.percentUsed, 100)}%` }}
                      />
                    </div>
                    <p className="mt-4 text-xs text-gray-400 font-medium">
                      {stats.percentUsed > 100
                        ? `You are over budget by ৳${Math.abs(stats.remaining).toLocaleString()}`
                        : `You still have ৳${stats.remaining.toLocaleString()} left from the collection.`}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: List (Matching Dashboard card style) */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col min-h-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Receipt className="text-rose-500" size={20} />
                    Expenses List
                  </h3>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {expenses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Receipt className="text-gray-300" size={32} />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">List is empty</h4>
                        <p className="text-xs text-gray-400 max-w-[160px]">Add potential trip costs to see the breakdown.</p>
                      </div>
                    ) : (
                      expenses.map((e, idx) => (
                        <div key={e.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50/80 transition-all border border-transparent hover:border-gray-100">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="text-[10px] font-mono font-bold text-gray-400 w-5">{(idx + 1).toString().padStart(2, '0')}</span>
                            <span className="font-semibold text-gray-900 text-sm truncate">{e.item}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-700 text-sm">৳{e.amount.toLocaleString()}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(e)} className="p-1.5 text-gray-300 hover:text-[#10B17D] hover:bg-white rounded-lg transition-colors cursor-pointer">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => setItemToDelete({ type: 'expense', id: e.id })} className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-white rounded-lg transition-colors cursor-pointer">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #e5e7eb; }
      `}</style>
    </div>
  );
}