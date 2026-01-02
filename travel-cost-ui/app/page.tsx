// app/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Download, Pencil, Trash2, Check, Map } from "lucide-react";

// --- IMPORTS ---
import { Trip } from './types';
import { Sidebar } from './components/Sidebar';                // FIXED: was '@app/...'
import { AddModal, DeleteConfirmModal } from './components/Modals'; // FIXED: use './' for consistency
import { StatCard } from './components/StatCard';              // FIXED: was '@app/...'

// --- GLOBAL STYLES (Hide arrows in inputs) ---
const globalStyles = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] { -moz-appearance: textfield; }
`;

export default function Dashboard() {
  // --- STATE ---
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1, name: "Cox's Bazar Trip", currency: "BDT",
      people: [
        { id: 1, name: "Maksud", deposit: 2000 },
        { id: 2, name: "Rahim", deposit: 1500 },
        { id: 3, name: "Tania", deposit: 1800 },
        { id: 4, name: "Sajid", deposit: 1200 },
        { id: 5, name: "Nabila", deposit: 2000 },
      ],
      expenses: [
        { id: 1, item: "Hotel", description: "2 nights", amount: 3500 },
        { id: 2, item: "Food", description: "Lunch + dinner", amount: 2200 },
        { id: 3, item: "Transport", description: "Bus tickets", amount: 1800 },
        { id: 4, item: "Tickets", description: "Sea beach entry", amount: 500 },
        { id: 5, item: "Snacks", description: "Water & snacks", amount: 600 },
      ]
    }
  ]);

  const [activeTripId, setActiveTripId] = useState<number>(1);
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'person' | 'expense' | 'trip'>('expense');
  const [editingRow, setEditingRow] = useState<{ type: 'person' | 'expense', id: number, tempValue: string } | null>(null);

  // Delete & Edit State
  const [itemToDelete, setItemToDelete] = useState<{ type: 'person' | 'expense' | 'trip', id: number } | null>(null);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

  // --- CALCULATIONS ---
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
    setTripToEdit(null); setModalType(type); setModalOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setTripToEdit(trip); setModalType('trip'); setModalOpen(true);
  };

  const handleDeleteTrip = (trip: Trip) => {
    if (trips.length <= 1) return alert("You must have at least one trip.");
    setItemToDelete({ type: 'trip', id: trip.id });
  };

  const saveData = (data: any) => {
    if (modalType === 'trip') {
      if (tripToEdit) {
        setTrips(trips.map(t => t.id === tripToEdit.id ? { ...t, name: data.name } : t));
        setTripToEdit(null);
      } else {
        const newTrip: Trip = { id: Date.now(), name: data.name, currency: "BDT", people: [], expenses: [] };
        setTrips([...trips, newTrip]); setActiveTripId(newTrip.id);
      }
    } else {
      setTrips(trips.map(t => {
        if (t.id !== activeTripId) return t;
        return modalType === 'person'
          ? { ...t, people: [...t.people, { id: Date.now(), ...data }] }
          : { ...t, expenses: [...t.expenses, { id: Date.now(), ...data }] };
      }));
    }
  };

  const saveInlineEdit = () => {
    if (!editingRow) return;
    const newValue = Number(editingRow.tempValue);
    if (newValue < 0) return alert("Value cannot be negative");
    setTrips(trips.map(t => {
      if (t.id !== activeTripId) return t;
      return editingRow.type === 'person'
        ? { ...t, people: t.people.map(p => p.id === editingRow.id ? { ...p, deposit: newValue } : p) }
        : { ...t, expenses: t.expenses.map(e => e.id === editingRow.id ? { ...e, amount: newValue } : e) };
    }));
    setEditingRow(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'trip') {
      const newTrips = trips.filter(t => t.id !== itemToDelete.id);
      setTrips(newTrips);
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

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <style>{globalStyles}</style>

      <AddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        onSave={saveData}
        initialData={tripToEdit}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={itemToDelete?.type === 'trip' ? "Delete Trip?" : "Are you sure?"}
        message={itemToDelete?.type === 'trip' ? "This will delete the trip and all data permanently." : undefined}
      />

      <Sidebar
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={setActiveTripId}
        onEditTrip={handleEditTrip}
        onDeleteTrip={handleDeleteTrip}
      />

      <main className="md:ml-64 flex-1 p-8">
        <header className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{activeTrip?.name}</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{activeTrip?.currency}</span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"><Download size={16} /> Export</button>
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
                <button onClick={() => handleAddClick('person')} className="flex items-center gap-1 text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition"><Plus size={14} /> Add</button>
              </div>
              <div className="space-y-3">
                {activeTrip.people.map((person) => {
                  const isEditing = editingRow?.type === 'person' && editingRow.id === person.id;
                  return (
                    <div key={person.id} className="flex items-center justify-between group h-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{person.name.charAt(0)}</div>
                        <span className="font-medium">{person.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input type="number" className="w-24 px-2 py-1 border border-blue-400 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200" value={editingRow.tempValue} onChange={(e) => setEditingRow({...editingRow, tempValue: e.target.value})} autoFocus />
                            <button onClick={saveInlineEdit} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={16} /></button>
                            <button onClick={() => setEditingRow(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                          </div>
                        ) : (
                          <>
                            <div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-md text-sm w-24 text-right">{person.deposit}</div>
                            <button onClick={() => setEditingRow({type: 'person', id: person.id, tempValue: person.deposit.toString()})} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Pencil size={14} /></button>
                            <button onClick={() => setItemToDelete({type: 'person', id: person.id})} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EXPENSES CARD */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Expenses</h3>
                <button onClick={() => handleAddClick('expense')} className="flex items-center gap-1 text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition"><Plus size={14} /> Add</button>
              </div>
              <div className="space-y-4">
                {activeTrip.expenses.map((expense) => {
                  const isEditing = editingRow?.type === 'expense' && editingRow.id === expense.id;
                  return (
                    <div key={expense.id} className="flex items-center justify-between group border-b border-gray-50 pb-3 last:border-0 last:pb-0 h-14">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{expense.item}</h4>
                        {expense.description && <p className="text-xs text-gray-400">{expense.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                           <div className="flex items-center gap-1">
                             <input type="number" className="w-24 px-2 py-1 border border-blue-400 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200" value={editingRow.tempValue} onChange={(e) => setEditingRow({...editingRow, tempValue: e.target.value})} autoFocus />
                             <button onClick={saveInlineEdit} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={16} /></button>
                             <button onClick={() => setEditingRow(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                           </div>
                        ) : (
                          <>
                            <span className="font-bold text-gray-900 text-sm mr-2 w-14 text-right">{expense.amount}</span>
                            <button onClick={() => setEditingRow({type: 'expense', id: expense.id, tempValue: expense.amount.toString()})} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Pencil size={14} /></button>
                            <button onClick={() => setItemToDelete({type: 'expense', id: expense.id})} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isRefund ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isRefund ? 'Refund' : 'Needs to add'}
                          </span>
                          <span className="font-bold text-gray-900 w-12 text-right">{isRefund ? '+' : ''}{Math.round(balance).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <Map size={48} className="mb-4 opacity-20" />
            <p>No trips found. Create one to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}