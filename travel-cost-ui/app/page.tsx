"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, X, Download, User, Pencil, Trash2, Check, AlertTriangle, Map, Globe } from "lucide-react";

// --- GLOBAL STYLES ---
const globalStyles = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] { -moz-appearance: textfield; }
`;

// --- TYPES ---
type Person = { id: number; name: string; deposit: number; };
type Expense = { id: number; item: string; description: string; amount: number; };
type Trip = { id: number; name: string; currency: string; people: Person[]; expenses: Expense[]; };

// --- COMPONENTS ---

const StatCard = ({ label, value, subtext }: { label: string, value: string, subtext?: string }) => (
  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
    <div>
      <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    {subtext && <p className="text-gray-300 text-[10px] mt-1">{subtext}</p>}
  </div>
);

const Sidebar = ({ trips, activeTripId, onSelectTrip, onEditTrip, onDeleteTrip }: any) => (
  <aside className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-y-auto hidden md:flex z-10">
    <div className="p-6 pb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Globe size={18} /></div>
        <h1 className="text-xl font-bold text-gray-900">Travel Split</h1>
      </div>
      <p className="text-xs text-gray-400 pl-11">Multi-trip manager</p>
    </div>
    <nav className="flex-1 px-4 space-y-6 mt-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Your Trips</h3>
        {trips.length === 0 ? (
          <p className="text-sm text-gray-400 px-2 italic mt-2">No trips yet.</p>
        ) : (
          <ul className="space-y-1">
            {trips.map((trip: Trip) => (
              <li key={trip.id} className="group relative">
                <button onClick={() => onSelectTrip(trip.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition pr-16 ${activeTripId === trip.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Map size={16} className={activeTripId === trip.id ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="truncate">{trip.name}</span>
                </button>
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 ${activeTripId === trip.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button onClick={(e) => { e.stopPropagation(); onEditTrip(trip); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md"><Pencil size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md"><Trash2 size={12} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
    <div className="p-6 border-t border-gray-50"><p className="text-xs text-gray-300">v0.4 Beta</p></div>
  </aside>
);

const AddModal = ({ isOpen, onClose, type, onSave, initialData }: any) => {
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState("");
  const [item, setItem] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (isOpen && initialData && type === 'trip') { setName(initialData.name); }
    else if (!isOpen) { setName(""); setDeposit(""); setItem(""); setDesc(""); setAmount(""); }
  }, [isOpen, initialData, type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'person') {
      const val = Number(deposit);
      if (val < 0) return alert("Deposit cannot be negative");
      onSave({ name, deposit: val });
    } else if (type === 'expense') {
      const val = Number(amount);
      if (val < 0) return alert("Cost cannot be negative");
      onSave({ item, description: desc, amount: val });
    } else if (type === 'trip') {
      if (!name) return alert("Trip Name is required");
      onSave({ name, currency: "BDT" });
    }
    onClose();
  };

  const getTitle = () => {
    if (type === 'trip') return initialData ? 'Edit Trip' : 'Create New Trip';
    return `Add New ${type === 'person' ? 'Person' : 'Expense'}`;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">{getTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'trip' && (
             <div><label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label><div className="relative"><Map className="absolute left-3 top-2.5 text-gray-400" size={16} /><input required type="text" placeholder="e.g., Saint Martin 2024" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={name} onChange={e => setName(e.target.value)} /></div></div>
          )}
          {type === 'person' && (
            <>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><div className="relative"><User className="absolute left-3 top-2.5 text-gray-400" size={16} /><input required type="text" placeholder="Name" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={name} onChange={e => setName(e.target.value)} /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit</label><div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span><input required type="number" min="0" placeholder="0" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={deposit} onChange={e => setDeposit(e.target.value)} /></div></div>
            </>
          )}
          {type === 'expense' && (
            <>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Item</label><input required type="text" placeholder="Expense Name" className="w-full px-4 py-2 border rounded-lg" value={item} onChange={e => setItem(e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" placeholder="Optional" className="w-full px-4 py-2 border rounded-lg" value={desc} onChange={e => setDesc(e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost</label><div className="relative"><span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span><input required type="number" min="0" placeholder="0" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={amount} onChange={e => setAmount(e.target.value)} /></div></div>
            </>
          )}
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{initialData && type === 'trip' ? 'Update Trip' : (type === 'trip' ? 'Create Trip' : 'Save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = "Are you sure?", message = "This action cannot be undone. This item will be permanently removed." }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><AlertTriangle size={24} /></div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-sm">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

export default function Dashboard() {
  // 1. STATE: INITIALIZED EMPTY
  const [trips, setTrips] = useState<Trip[]>([]);

  const [activeTripId, setActiveTripId] = useState<number>(0);
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'person' | 'expense' | 'trip'>('expense');
  const [editingRow, setEditingRow] = useState<{ type: 'person' | 'expense', id: number, tempValue: string } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'person' | 'expense' | 'trip', id: number } | null>(null);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

  const stats = useMemo(() => {
    if (!activeTrip) return { totalDeposits: 0, totalExpenses: 0, remaining: 0, avgCost: 0 };
    const totalDeposits = activeTrip.people.reduce((sum, p) => sum + p.deposit, 0);
    const totalExpenses = activeTrip.expenses.reduce((sum, e) => sum + e.amount, 0);
    return { totalDeposits, totalExpenses, remaining: totalDeposits - totalExpenses, avgCost: activeTrip.people.length > 0 ? totalExpenses / activeTrip.people.length : 0 };
  }, [activeTrip]);

  const handleAddClick = (type: 'person' | 'expense' | 'trip') => { setTripToEdit(null); setModalType(type); setModalOpen(true); };
  const handleEditTrip = (trip: Trip) => { setTripToEdit(trip); setModalType('trip'); setModalOpen(true); };

  // UPDATED: No restriction on deleting the last trip
  const handleDeleteTrip = (trip: Trip) => { setItemToDelete({ type: 'trip', id: trip.id }); };

  const saveData = (data: any) => {
    if (modalType === 'trip') {
      if (tripToEdit) { setTrips(trips.map(t => t.id === tripToEdit.id ? { ...t, name: data.name } : t)); setTripToEdit(null); }
      else { const newTrip: Trip = { id: Date.now(), name: data.name, currency: "BDT", people: [], expenses: [] }; setTrips([...trips, newTrip]); setActiveTripId(newTrip.id); }
    } else {
      setTrips(trips.map(t => {
        if (t.id !== activeTripId) return t;
        return modalType === 'person' ? { ...t, people: [...t.people, { id: Date.now(), ...data }] } : { ...t, expenses: [...t.expenses, { id: Date.now(), ...data }] };
      }));
    }
  };

  const saveInlineEdit = () => {
    if (!editingRow) return;
    const newValue = Number(editingRow.tempValue);
    if (newValue < 0) return alert("Value cannot be negative");
    setTrips(trips.map(t => {
      if (t.id !== activeTripId) return t;
      return editingRow.type === 'person' ? { ...t, people: t.people.map(p => p.id === editingRow.id ? { ...p, deposit: newValue } : p) } : { ...t, expenses: t.expenses.map(e => e.id === editingRow.id ? { ...e, amount: newValue } : e) };
    }));
    setEditingRow(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'trip') {
      const newTrips = trips.filter(t => t.id !== itemToDelete.id); setTrips(newTrips);
      // Logic to switch active trip if the current one is deleted
      if (activeTripId === itemToDelete.id) setActiveTripId(newTrips[0]?.id || 0);
    } else {
      setTrips(trips.map(t => {
        if (t.id !== activeTripId) return t;
        return itemToDelete.type === 'person' ? { ...t, people: t.people.filter(p => p.id !== itemToDelete.id) } : { ...t, expenses: t.expenses.filter(e => e.id !== itemToDelete.id) };
      }));
    }
    setItemToDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <style>{globalStyles}</style>
      <AddModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} onSave={saveData} initialData={tripToEdit} />
      <DeleteConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} title={itemToDelete?.type === 'trip' ? "Delete Trip?" : "Are you sure?"} message={itemToDelete?.type === 'trip' ? "This will delete the trip and all data." : undefined} />

      <Sidebar trips={trips} activeTripId={activeTripId} onSelectTrip={setActiveTripId} onEditTrip={handleEditTrip} onDeleteTrip={handleDeleteTrip} />

      <main className="md:ml-64 flex-1 p-8">
        <header className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{activeTrip ? activeTrip.name : "Welcome"}</h2>
            {activeTrip && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{activeTrip.currency}</span>}
          </div>
          <div className="flex gap-3">
            {activeTrip && <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"><Download size={16} /> Export</button>}
            <button onClick={() => handleAddClick('trip')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"><Plus size={16} /> New Trip</button>
          </div>
        </header>

        {activeTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-800">People</h3><button onClick={() => handleAddClick('person')} className="flex items-center gap-1 text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition"><Plus size={14} /> Add</button></div>
              <div className="space-y-3">
                {activeTrip.people.map((person) => {
                  const isEditing = editingRow?.type === 'person' && editingRow.id === person.id;
                  return (
                    <div key={person.id} className="flex items-center justify-between group h-10">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{person.name.charAt(0)}</div><span className="font-medium">{person.name}</span></div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1"><input type="number" className="w-24 px-2 py-1 border border-blue-400 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200" value={editingRow.tempValue} onChange={(e) => setEditingRow({...editingRow, tempValue: e.target.value})} autoFocus /><button onClick={saveInlineEdit} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={16} /></button><button onClick={() => setEditingRow(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16} /></button></div>
                        ) : (
                          <><div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-md text-sm w-24 text-right">{person.deposit}</div><button onClick={() => setEditingRow({type: 'person', id: person.id, tempValue: person.deposit.toString()})} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Pencil size={14} /></button><button onClick={() => setItemToDelete({type: 'person', id: person.id})} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button></>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-800">Expenses</h3><button onClick={() => handleAddClick('expense')} className="flex items-center gap-1 text-sm bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition"><Plus size={14} /> Add</button></div>
              <div className="space-y-4">
                {activeTrip.expenses.map((expense) => {
                  const isEditing = editingRow?.type === 'expense' && editingRow.id === expense.id;
                  return (
                    <div key={expense.id} className="flex items-center justify-between group border-b border-gray-50 pb-3 last:border-0 last:pb-0 h-14">
                      <div><h4 className="font-bold text-gray-900 text-sm">{expense.item}</h4>{expense.description && <p className="text-xs text-gray-400">{expense.description}</p>}</div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                           <div className="flex items-center gap-1"><input type="number" className="w-24 px-2 py-1 border border-blue-400 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200" value={editingRow.tempValue} onChange={(e) => setEditingRow({...editingRow, tempValue: e.target.value})} autoFocus /><button onClick={saveInlineEdit} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={16} /></button><button onClick={() => setEditingRow(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16} /></button></div>
                        ) : (
                          <><span className="font-bold text-gray-900 text-sm mr-2 w-14 text-right">{expense.amount}</span><button onClick={() => setEditingRow({type: 'expense', id: expense.id, tempValue: expense.amount.toString()})} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Pencil size={14} /></button><button onClick={() => setItemToDelete({type: 'expense', id: expense.id})} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button></>
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
            <button onClick={() => handleAddClick('trip')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm">
              <Plus size={18} /> Create First Trip
            </button>
          </div>
        )}
      </main>
    </div>
  );
}