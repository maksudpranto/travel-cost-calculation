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
  ShieldAlert,
  Lock,
  Unlock
} from "lucide-react";
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { AddModal, DeleteConfirmModal, ConfirmModal } from "./Modals";
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
  const [isBasicLocked, setIsBasicLocked] = useState(false);
  const [isBasicDetailsEditing, setIsBasicDetailsEditing] = useState(true);

  // --- APP STATE (For Sidebar & Navigation) ---
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'profile' | 'trip' | 'bulk_trip'>('profile');
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'person' | 'expense' | 'trip' | 'profile'; id: number } | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
    } finally {
      setIsTripsFetched(true);
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
  const [tourStatus, setTourStatus] = useState<'active' | 'completed'>('active');
  const [expenses, setExpenses] = useState<{ id: number; item: string; amount: number }[]>([]);

  // --- FORM STATE ---
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // --- EDIT & DELETE STATE ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isTripsFetched, setIsTripsFetched] = useState(false);

  // --- PERSISTENCE & LOADING ---
  useEffect(() => {
    const tripId = searchParams.get('tripId');

    if (tripId) {
      if (trips.length > 0) {
        const selected = trips.find(t => t.id === parseInt(tripId));
        if (selected && selected.type === 'bulk') {
          setCurrentTripId(selected.id);
          setActiveTripName(selected.name);
          setTouristCount(selected.touristCount ?? '');
          setFeePerPerson(selected.feePerPerson ?? '');
          setTourStatus(selected.status || 'active');
          setIsBasicLocked(true);

          setExpenses(selected.expenses.map(e => ({ id: e.id, item: e.item, amount: e.amount })));
        }
      }
    } else {
      setCurrentTripId(null);
      setActiveTripName("New Calculation");

      if (!isLoaded) {
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
      } else {
        setTouristCount('');
        setFeePerPerson('');
        setExpenses([]);
        localStorage.removeItem('bulk_calc_data');
      }
    }
    setIsLoaded(true);
  }, [searchParams, trips]);

  // Persist to localStorage for "New Calculations" only
  useEffect(() => {
    if (isLoaded && !currentTripId) {
      const dataToSave = { touristCount, feePerPerson, expenses };
      localStorage.setItem('bulk_calc_data', JSON.stringify(dataToSave));
    }
  }, [touristCount, feePerPerson, expenses, isLoaded, currentTripId]);

  // Redirect if no bulk tours remain
  useEffect(() => {
    if (isTripsFetched) {
      const bulkTrips = trips.filter(t => t.type === 'bulk');
      if (bulkTrips.length === 0) {
        router.push('/agent_dashboard');
      }
    }
  }, [isTripsFetched, trips, router]);

  // --- HANDLERS ---

  const handleNewCalculation = () => {
    setEditingTrip(null);
    setModalType('bulk_trip');
    setModalOpen(true);
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
          status: tourStatus,
          expenses
        })
      });
      if (res.ok) {
        fetchTrips(); // Ensure trips are re-fetched after update
      }
    } catch (e) {
      console.error("Failed to update trip", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTrip = async (data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          type: 'bulk',
          touristCount: data.touristCount || touristCount,
          feePerPerson: data.feePerPerson || feePerPerson,
          status: tourStatus,
          expenses: expenses.map(e => ({ id: e.id, item: e.item, amount: e.amount }))
        }),
      });

      if (res.ok) {
        const newTrip = await res.json();
        setCurrentTripId(newTrip.id);
        setActiveTripName(newTrip.name);
        setTouristCount(data.touristCount || '');
        setFeePerPerson(data.feePerPerson || '');
        setExpenses([]);
        setTourStatus('active');
        setIsBasicLocked(true);
        setModalOpen(false);
        fetchTrips(); // Ensure trips are re-fetched after add
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
        router.push('/bulk_calculation');
      }
    }
    setItemToDelete(null);
  };

  const handleToggleStatus = async (newStatus: 'active' | 'completed') => {
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
          status: newStatus,
          expenses: expenses.map(e => ({ id: e.id, item: e.item, amount: e.amount }))
        })
      });
      if (res.ok) {
        setTourStatus(newStatus);
        if (newStatus === 'completed') {
          // If ending, redirect to agent dashboard
          router.push('/agent_dashboard');
        } else {
          fetchTrips(); // Re-fetch to update sidebar status
        }
      }
    } catch (e) {
      console.error("Failed to update trip status", e);
    } finally {
      setIsSaving(false);
      setShowStatusModal(false);
    }
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
          } else if (modalType === 'bulk_trip') {
            await handleAddTrip(data);
          }
        }}
        initialData={editingTrip ? { name: editingTrip.name } : (modalType === 'profile' ? { name: session?.user?.name, image: session?.user?.image } : undefined)}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={`Remove ${itemToDelete?.type}?`}
        message={itemToDelete?.type === 'trip' ? "This will permanently remove this saved calculation." : "Are you sure you want to remove this expense?"}
      />

      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={() => handleToggleStatus(tourStatus === 'completed' ? 'active' : 'completed')}
        title={tourStatus === 'completed' ? "Reopen Tour?" : "End Group Tour?"}
        message={tourStatus === 'completed'
          ? "This will reopen the calculation for new expenses and modifications."
          : "This will lock all input fields and expenses. You can reopen it later if needed."}
        confirmText={tourStatus === 'completed' ? "Reopen Now" : "End Tour"}
        variant={tourStatus === 'completed' ? 'success' : 'warning'}
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
          setModalType(trip.type === 'bulk' ? 'bulk_trip' : 'trip');
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
                {currentTripId && (
                  <button
                    onClick={() => {
                      setShowStatusModal(true);
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${tourStatus === 'completed' ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'} shadow-lg`}
                  >
                    {tourStatus === 'completed' ? <Unlock size={16} /> : <Lock size={16} />}
                    <span>{tourStatus === 'completed' ? 'Reopen Tour' : 'End Tour'}</span>
                  </button>
                )}
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
                label={tourStatus === 'completed' ? "Total Profit" : "Remaining Fund"}
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
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-[#10B17D]" size={20} />
                        Basic Details
                      </h3>
                      {!isBasicLocked && tourStatus !== 'completed' && (
                        <button
                          onClick={() => {
                            if (currentTripId) {
                              updateSavedTrip();
                            }
                            setIsBasicLocked(true);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${isSaving ? 'bg-gray-400' : 'bg-[#10B17D] hover:bg-[#0D8F65] shadow-[#10B17D]/20'}`}
                        >
                          <Check size={16} />
                          <span>Save</span>
                        </button>
                      )}
                      {isBasicLocked && tourStatus !== 'completed' && (
                        <button
                          onClick={() => setIsBasicLocked(false)}
                          className="p-2 text-gray-400 hover:text-[#10B17D] hover:bg-gray-50 rounded-xl transition-all active:scale-95 cursor-pointer"
                          title="Edit Basic Details"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                    </div>
                  </div>
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
                          disabled={tourStatus === 'completed' || isBasicLocked}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#10B17D]/20 focus:border-[#10B17D] outline-none transition-all ${tourStatus === 'completed' || isBasicLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                          disabled={tourStatus === 'completed' || isBasicLocked}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#10B17D]/20 focus:border-[#10B17D] outline-none transition-all ${tourStatus === 'completed' || isBasicLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        disabled={tourStatus === 'completed'}
                        className={`w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#10B17D] focus:ring-2 focus:ring-[#10B17D]/20 transition-all font-medium ${tourStatus === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                          disabled={tourStatus === 'completed'}
                          className={`w-full pl-8 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#10B17D] focus:ring-2 focus:ring-[#10B17D]/20 transition-all font-bold ${tourStatus === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={tourStatus === 'completed'}
                        className={`px-6 bg-[#10B17D] text-white rounded-xl hover:bg-[#0D8F65] shadow-lg shadow-[#10B17D]/20 transition-all active:scale-95 flex items-center justify-center gap-2 font-bold ${tourStatus === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {editingId ? <Check size={18} /> : <Plus size={18} />}
                        <span>{editingId ? 'Save' : 'Add'}</span>
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
                              <button onClick={() => startEdit(e)} disabled={tourStatus === 'completed'} className={`p-1.5 text-gray-300 hover:text-[#10B17D] hover:bg-white rounded-lg transition-colors cursor-pointer ${tourStatus === 'completed' ? 'opacity-10 cursor-not-allowed' : ''}`}>
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => setItemToDelete({ type: 'expense', id: e.id })} disabled={tourStatus === 'completed'} className={`p-1.5 text-gray-300 hover:text-rose-500 hover:bg-white rounded-lg transition-colors cursor-pointer ${tourStatus === 'completed' ? 'opacity-10 cursor-not-allowed' : ''}`}>
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
            </div >
          </div >
        )
        }
      </main >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #e5e7eb; }
      `}</style>
    </div >
  );
}