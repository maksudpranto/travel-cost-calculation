"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download, Menu, Map, Calculator } from "lucide-react"; // Calculator Icon
import Link from 'next/link'; // Link Component

// --- IMPORTS ---
import { Trip } from './types';
import { Sidebar } from './components/Sidebar';
import { AddModal, DeleteConfirmModal } from './components/Modals';

// --- COMPONENT IMPORTS ---
import { PeopleCard } from './components/PeopleCard';
import { ExpensesCard } from './components/ExpensesCard';
import { BalancesCard } from './components/BalancesCard';
import { SummaryGrid } from './components/SummaryGrid';

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

            {/* --- UPDATED LINK: Points to app/calculator/page.tsx --- */}
            <Link href="/Bulk">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Calculator size={16} /> Bulk Cost Calculator
              </button>
            </Link>

            {activeTrip && <button onClick={handleExport} className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"><Download size={16} /> Export</button>}
            <button onClick={() => handleAddClick('trip')} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm"><Plus size={16} /> New Trip</button>
          </div>
        </header>

        {activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PeopleCard
              people={activeTrip.people}
              onAdd={() => handleAddClick('person')}
              onEdit={(p) => handleEditItem('person', p)}
              onDelete={(id) => handleDeleteItem('person', id)}
            />
            <ExpensesCard
              expenses={activeTrip.expenses}
              onAdd={() => handleAddClick('expense')}
              onEdit={(e) => handleEditItem('expense', e)}
              onDelete={(id) => handleDeleteItem('expense', id)}
            />
          </div>
          <div className="space-y-6">
            <SummaryGrid stats={stats} />
            <BalancesCard people={activeTrip.people} avgCost={stats.avgCost} />
          </div>
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400 text-center">
            <Map size={48} className="mb-4 opacity-20" />
            <p className="mb-4">No trips found. Create one to get started!</p>
            <button onClick={() => handleAddClick('trip')} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition shadow-sm"><Plus size={18} /> Create First Trip</button>
          </div>
        )}
      </main>
    </div>
  );
}