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
  Menu
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

    if (!newItem || newAmount === '') return;

    const amountVal = parseFloat(newAmount);
    if (isNaN(amountVal) || amountVal < 0) return;

    if (editingId) {
      // UPDATE EXISTING
      setExpenses(expenses.map(e =>
        e.id === editingId ? { ...e, item: newItem, amount: amountVal } : e
      ));
      setEditingId(null); // Exit edit mode
    } else {
      // ADD NEW
      setExpenses([...expenses, { id: Date.now(), item: newItem, amount: amountVal }]);
    }

    // Clear inputs
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
        onEditTrip={() => { }} // Not needed here
        onDeleteTrip={() => { }} // Not needed here
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={session?.user}
        onEditProfile={handleEditProfile}
        onLogout={handleLogout}
      />

      <main className="md:ml-72 flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 space-y-8 md:space-y-10">

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
                <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">Manage budget for large groups</p>
              </div>
            </div>
            <Link href="/" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:text-[#10B17D] hover:bg-gray-50 transition-all cursor-pointer">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

              {/* 1. CONFIGURATION CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tour Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Tourist Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tourists</label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={touristCount}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') setTouristCount('');
                          else setTouristCount(Math.max(0, parseInt(val)));
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Fee Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fee Per Person</label>
                    <div className="relative group">
                      <Ticket className="absolute left-3 top-3 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={feePerPerson}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') setFeePerPerson('');
                          else setFeePerPerson(Math.max(0, parseFloat(val)));
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. ADD / EDIT EXPENSE FORM */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
                  {editingId && (
                    <button onClick={cancelEdit} className="text-xs text-red-500 font-bold hover:underline">Cancel Edit</button>
                  )}
                </div>

                <form onSubmit={handleExpenseSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#10B17D] transition-all"
                  />

                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="Cost"
                      value={newAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || Number(val) >= 0) setNewAmount(val);
                      }}
                      className="flex-1 sm:w-32 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#10B17D] transition-all"
                    />

                    <button
                      type="submit"
                      className={`p-3 rounded-xl transition-all shadow-lg text-white flex items-center justify-center min-w-[50px] shrink-0 ${editingId
                        ? 'bg-[#10B17D] hover:bg-[#0D8F65] shadow-[#10B17D]/20'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                        }`}
                    >
                      {editingId ? <Check size={24} /> : <Plus size={24} />}
                    </button>
                  </div>
                </form>

                {/* EXPENSE LIST */}
                <div className="mt-6 space-y-2">
                  {expenses.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">No expenses added yet.</p>
                  )}
                  {expenses.map(e => (
                    <div key={e.id} className={`flex justify-between items-center p-3 rounded-xl border transition-all group ${editingId === e.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-100'}`}>
                      <span className="font-medium text-gray-700 break-all mr-2">{e.item}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-gray-900">৳{e.amount.toLocaleString()}</span>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(e)} className="text-gray-300 hover:text-blue-500 transition-colors p-1.5 hover:bg-blue-50 rounded-lg">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteId(e.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BIG STATS */}
            <div className="space-y-6">

              {/* TOTAL BUDGET CARD */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                <div className="flex items-center gap-3 mb-2 opacity-80">
                  <Wallet size={20} />
                  <span className="text-sm font-medium uppercase tracking-wider">Total Collection</span>
                </div>
                <div className="text-4xl font-extrabold mb-1 break-all leading-tight">
                  ৳{stats.totalCollection.toLocaleString()}
                </div>
                <p className="text-blue-100 text-sm">
                  {stats.safeCount} tourists × ৳{stats.safeFee}
                </p>
              </div>

              {/* REMAINING MONEY CARD */}
              <div className={`bg-white rounded-2xl p-6 border-l-4 shadow-sm ${stats.remaining >= 0 ? 'border-emerald-500' : 'border-rose-500'}`}>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Remaining Money</p>
                <h2 className={`text-3xl font-extrabold break-all leading-tight ${stats.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ৳{stats.remaining.toLocaleString()}
                </h2>

                {/* Budget Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                    <span>Budget Used</span>
                    <span>{Math.round(stats.percentUsed)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stats.percentUsed > 100 ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(stats.percentUsed, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* BREAKDOWN GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="mb-2 p-2 bg-teal-50 w-fit rounded-lg text-teal-600"><TrendingDown size={20} /></div>
                  <p className="text-gray-400 text-xs font-bold uppercase">Total Cost</p>
                  <p className="text-xl font-bold text-gray-900 break-all">৳{stats.totalCost.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="mb-2 p-2 bg-teal-50 w-fit rounded-lg text-teal-600"><Users size={20} /></div>
                  <p className="text-gray-400 text-xs font-bold uppercase">Cost / Head</p>
                  <p className="text-xl font-bold text-gray-900 break-all">৳{Math.round(stats.avgCostPerHead).toLocaleString()}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}