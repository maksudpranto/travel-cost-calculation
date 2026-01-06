"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
  X
} from "lucide-react";
import Link from 'next/link';
import { DeleteConfirmModal } from './Modals';

export default function BulkCalculation() {
  // --- STATE ---
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-8">

      {/* --- MODAL: Delete Confirmation --- */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Expense?"
        message="Are you sure you want to remove this expense?"
      />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center gap-4">
        <Link href="/" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-600"/>
        </Link>
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="text-blue-600" /> Fixed Tour Calculator
            </h1>
            <p className="text-sm text-gray-500">Manage budget for large groups</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

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

             <form onSubmit={handleExpenseSubmit} className="flex gap-3">
                <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                    type="number"
                    min="0"
                    placeholder="Cost"
                    value={newAmount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || Number(val) >= 0) setNewAmount(val);
                    }}
                    className="w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* DYNAMIC BUTTON */}
                <button
                    type="submit"
                    className={`p-2.5 rounded-xl transition-all shadow-lg text-white flex items-center justify-center min-w-[50px] ${
                      editingId
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    }`}
                >
                    {editingId ? <Check size={24} /> : <Plus size={24} />}
                </button>
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
                    <div className="mb-2 p-2 bg-rose-50 w-fit rounded-lg text-rose-600"><TrendingDown size={20} /></div>
                    <p className="text-gray-400 text-xs font-bold uppercase">Total Cost</p>
                    <p className="text-xl font-bold text-gray-900 break-all">৳{stats.totalCost.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="mb-2 p-2 bg-purple-50 w-fit rounded-lg text-purple-600"><Users size={20} /></div>
                    <p className="text-gray-400 text-xs font-bold uppercase">Cost / Head</p>
                    <p className="text-xl font-bold text-gray-900 break-all">৳{Math.round(stats.avgCostPerHead).toLocaleString()}</p>
                </div>
            </div>

             {/* REMOVED THE PROFIT/LOSS SECTION HERE */}

        </div>
      </div>
    </div>
  );
}