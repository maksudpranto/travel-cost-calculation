"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download, Pencil, Trash2, Menu, Check } from "lucide-react";

// --- IMPORTS ---
import { Trip } from './types';
import { Sidebar } from './components/Sidebar';
import { AddModal, DeleteConfirmModal } from './components/Modals';
import { StatCard } from './components/StatCard';

// --- CSS ---
const globalStyles = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] { -moz-appearance: textfield; }
`;

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<number>(0);
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('travel_split_data');
    if (saved) setTrips(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('travel_split_data', JSON.stringify(trips));
  }, [trips, isLoaded]);

  useEffect(() => {
    if (isLoaded && trips.length > 0 && activeTripId === 0) setActiveTripId(trips[0].id);
  }, [isLoaded, trips, activeTripId]);

  // --- UI STATES ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'person' | 'expense' | 'trip'>('expense');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'person' | 'expense' | 'trip', id: number } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const stats = useMemo(() => {
    if (!activeTrip) return { totalDeposits: 0, totalExpenses: 0, remaining: 0, avgCost: 0 };
    const totalDeposits = activeTrip.people.reduce((sum, p) => sum + p.deposit, 0);
    const totalExpenses = activeTrip.expenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      totalDeposits, totalExpenses, remaining: totalDeposits - totalExpenses,
      avgCost: activeTrip.people.length > 0 ? totalExpenses / activeTrip.people.length : 0
    };
  }, [activeTrip]);

  // --- HANDLERS ---
  const handleAddClick = (type: 'person' | 'expense' | 'trip') => {
    setEditingItem(null); setModalType(type); setModalOpen(true);
  };
  const handleEditItem = (type: 'person' | 'expense' | 'trip', item: any) => {
    setEditingItem(item); setModalType(type); setModalOpen(true);
  };
  const handleDeleteItem = (type: 'person' | 'expense' | 'trip', id: number) => {
    setItemToDelete({ type, id });
  };

  const handleExport = () => {
    if (!activeTrip) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `TRIP REPORT: ${activeTrip.name} (${activeTrip.currency})\n\nSUMMARY\nTotal Deposits,${stats.totalDeposits}\nTotal Expenses,${stats.totalExpenses}\nRemaining Fund,${stats.remaining}\nCost Per Person,${Math.round(stats.avgCost)}\n\nPEOPLE & DEPOSITS\nName,Deposit,Status,Amount\n`;
    activeTrip.people.forEach(p => {
        const balance = p.deposit - stats.avgCost;
        const status = balance > 0 ? "Refund" : (balance < 0 ? "Owes" : "Settled");
        csvContent += `${p.name},${p.deposit},${status},${Math.round(Math.abs(balance))}\n`;
    });
    csvContent += `\nEXPENSES\nItem,Description,Cost\n`;
    activeTrip.expenses.forEach(e => { csvContent += `${e.item},${e.description},${e.amount}\n`; });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTrip.name.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveData = (data: any) => {
    if (modalType === 'trip') {
      if (editingItem) {
        setTrips(trips.map(t => t.id === editingItem.id ? { ...t, name: data.name } : t));
      } else {
        const newTrip: Trip = { id: Date.now(), name: data.name, currency: "BDT", people: [], expenses: [] };
        setTrips([...trips, newTrip]); setActiveTripId(newTrip.id);
      }
    } else {
      setTrips(trips.map(t => {
        if (t.id !== activeTripId) return t;
        if (modalType === 'person') {
          return editingItem
            ? { ...t, people: t.people.map(p => p.id === editingItem.id ? { ...p, ...data } : p) }
            : { ...t, people: [...t.people, { id: Date.now(), ...data }] };
        } else {
          return editingItem
            ? { ...t, expenses: t.expenses.map(e => e.id === editingItem.id ? { ...e, ...data } : e) }
            : { ...t, expenses: [...t.expenses, { id: Date.now(), ...data }] };
        }
      }));
    }
    setEditingItem(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'trip') {
      const newTrips = trips.filter(t => t.id !== itemToDelete.id); setTrips(newTrips);
      if (activeTripId === itemToDelete.id) setActiveTripId(newTrips[0]?.id || 0);
    } else {
      setTrips(trips.map(t => {
        if (t.id !== activeTripId) return t;
        return itemToDelete.type === 'person'
          ? { ...t, people: t.people.filter(p => p.id !== itemToDelete.id) }
          : { ...t, expenses: t.expenses.filter(e => e.id !== itemToDelete.id) };
      }));
    }
    setItemToDelete(null);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <style>{globalStyles}</style>
      <AddModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} onSave={saveData} initialData={editingItem} />
      <DeleteConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} title={itemToDelete?.type === 'trip' ? "Delete Trip?" : "Are you sure?"} message={itemToDelete?.type === 'trip' ? "This will delete the trip and all data." : undefined} />

      <Sidebar
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={setActiveTripId}
        onEditTrip={(trip: Trip) => handleEditItem('trip', trip)}
        onDeleteTrip={(trip: Trip) => handleDeleteItem('trip', trip.id)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="md:ml-64 flex-1 p-8">
        <header className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
            <h2 className="text-xl font-bold">{activeTrip ? activeTrip.name : "Welcome"}</h2>
            {activeTrip && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{activeTrip.currency}</span>}
          </div>
          <div className="flex gap-3">
            {activeTrip && <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"><Download size={16} /> Export</button>}
            <button onClick={() => handleAddClick('trip')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"><Plus size={16} /> New Trip</button>
          </div>
        </header>

        {activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* PEOPLE CARD */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">People</h3>
                <button onClick={() => handleAddClick('person')} className="flex items-center gap-1 text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {activeTrip.people.map((person) => (
                    <div key={person.id} className="flex items-center justify-between group h-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {person.name.charAt(0)}
                        </div>
                        <span className="font-medium">{person.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          {/* UPDATED: Modern Shadcn Amount Badge */}
                          <div className="font-medium tabular-nums text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm w-28 text-right">
                            {person.deposit.toLocaleString()}
                          </div>

                          <button onClick={() => handleEditItem('person', person)} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded transition"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteItem('person', person.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* EXPENSES CARD */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Expenses</h3>
                <button onClick={() => handleAddClick('expense')} className="flex items-center gap-1 text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-4">
                {activeTrip.expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between group border-b border-gray-50 pb-3 last:border-0 last:pb-0 h-14">
                      <div className="flex-1 mr-4">
                        <h4 className="font-bold text-gray-900 text-sm">{expense.item}</h4>
                        {expense.description && <p className="text-xs text-gray-400 truncate">{expense.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                          {/* UPDATED: Modern Shadcn Amount Badge */}
                          <div className="font-medium tabular-nums text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm w-28 text-right mr-2">
                             {expense.amount.toLocaleString()}
                          </div>

                          <button onClick={() => handleEditItem('expense', expense)} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded transition"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteItem('expense', expense.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <StatCard label="Total Deposits" value={stats.totalDeposits.toLocaleString()} />
                <StatCard label="Total Expenses" value={stats.totalExpenses.toLocaleString()} />
                <StatCard label="Remaining Fund" value={stats.remaining.toLocaleString()} />
                <StatCard label="Avg / Person" value={Math.round(stats.avgCost).toLocaleString()} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Balances</h3>
              <div className="space-y-5">
                {activeTrip.people.map((person) => {
                  const balance = person.deposit - stats.avgCost;
                  const isRefund = balance > 0;
                  const isSettled = balance === 0;
                  return (
                    <div key={person.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-900 font-medium">{person.name}</span>
                      {isSettled ? <span className="text-gray-400 text-xs">Settled</span> : (
                        <div className="flex items-center gap-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isRefund ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isRefund ? 'Refund' : 'Needs to add'}</span><span className="font-bold text-gray-900 w-12 text-right">{isRefund ? '+' : ''}{Math.round(balance).toLocaleString()}</span></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400 text-center">
            <Map size={48} className="mb-4 opacity-20" />
            <p className="mb-4">No trips found. Create one to get started!</p>
            <button onClick={() => handleAddClick('trip')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm"><Plus size={18} /> Create First Trip</button>
          </div>
        )}
      </main>
    </div>
  );
}