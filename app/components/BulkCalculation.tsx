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
  Coins
} from "lucide-react";
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { AddModal, DeleteConfirmModal } from './Modals';
import { Trip } from '../type';

export default function BulkCalculation() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // --- APP STATE (For Sidebar & Navigation) ---
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'profile'>('profile');

  // --- FETCH TRIPS FOR SIDEBAR ---
  useEffect(() => {
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

  // --- PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('bulk_calc_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTouristCount(data.touristCount || '');
        setFeePerPerson(data.feePerPerson || '');
        setExpenses(data.expenses || []);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const dataToSave = { touristCount, feePerPerson, expenses };
      localStorage.setItem('bulk_calc_data', JSON.stringify(dataToSave));
    }
  }, [touristCount, feePerPerson, expenses, isLoaded]);

  // --- CALCULATIONS ---
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
  const confirmDelete = () => {
    if (deleteId) {
      setExpenses(expenses.filter(e => e.id !== deleteId));
      setDeleteId(null);
      if (editingId === deleteId) cancelEdit();
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
        onClose={() => setModalOpen(false)}
        type={modalType}
        onSave={async (data) => {
          if (modalType === 'profile') {
            await authClient.updateUser({ name: data.name, image: data.image });
            setModalOpen(false);
          }
        }}
        initialData={{ name: session?.user?.name, image: session?.user?.image }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Expense?"
        message="Are you sure you want to remove this expense?"
      />

      <Sidebar
        trips={trips}
        activeTripId={0}
        onSelectTrip={(id) => router.push(`/dashboard?tripId=${id}`)}
        onEditTrip={() => { }}
        onDeleteTrip={() => { }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={session?.user}
        onEditProfile={handleEditProfile}
        onLogout={handleLogout}
      />

      <main className="md:ml-72 flex-1 min-w-0">
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
                  <span className="truncate">Calculator</span>
                </h1>
                <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">Quick budget planning for any trip</p>
              </div>
            </div>
            <Link href="/" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-[#10B17D] hover:bg-gray-50 transition-all cursor-pointer">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
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
                            <button onClick={() => setDeleteId(e.id)} className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-white rounded-lg transition-colors cursor-pointer">
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