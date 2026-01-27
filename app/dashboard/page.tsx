"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Plus, Download, Menu, Map as MapIcon, ArrowUp, Calendar, Lock, Unlock } from "lucide-react";
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

// --- IMPORTANT: UPDATED IMPORTS (added ../) ---
import { Trip } from '../type';
import { Sidebar } from '../components/Sidebar';
import { AddModal, DeleteConfirmModal, ConfirmModal } from '../components/Modals';
import { PeopleCard } from '../components/PeopleCard';
import { ExpensesCard } from '../components/ExpensesCard';
import { BalancesCard } from '../components/BalancesCard';
import { SummaryGrid } from '../components/SummaryGrid';
import { DashboardCharts } from '../components/DashboardCharts';

const globalStyles = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] { -moz-appearance: textfield; }
  html { scroll-behavior: smooth; }
`;

function DashboardContent() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  // --- APP STATE ---
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<number>(0);
  const ongoingTrips = useMemo(() => trips.filter(t => t.type !== 'bulk' && t.status !== 'completed'), [trips]);
  const activeTrip = trips.find(t => t.id === activeTripId) || ongoingTrips[0];
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- SCROLL TO TOP STATE ---
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- PERSISTENCE (API) ---
  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
        setIsLoaded(true);
        const ongoing = data.filter((t: any) => t.type !== 'bulk' && t.status !== 'completed');
        if (data.length > 0) {
          if (tripIdParam) {
            setActiveTripId(Number(tripIdParam));
          } else if (activeTripId === 0 && ongoing.length > 0) {
            setActiveTripId(ongoing[0].id);
          }
        }
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
  }, [session, tripIdParam]);


  // --- SCROLL LISTENER ---
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- UI STATES ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'person' | 'expense' | 'trip' | 'profile' | 'bulk_trip'>('expense');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'person' | 'expense' | 'trip', id: number } | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    if (!activeTrip) return {
      totalDeposits: 0,
      totalExpenses: 0,
      remaining: 0,
      avgCost: 0,
      maxCost: 0,
      minCost: 0,
      maxExpenseName: '-',
      minExpenseName: '-'
    };

    const totalDeposits = activeTrip.people.reduce((sum, p) => sum + p.deposit, 0);
    const totalExpenses = activeTrip.expenses.reduce((sum, e) => sum + e.amount, 0);

    // Find Max and Min Expense Objects to get Name & Amount
    let maxExpense = null;
    let minExpense = null;

    if (activeTrip.expenses.length > 0) {
      maxExpense = activeTrip.expenses.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
      minExpense = activeTrip.expenses.reduce((prev, current) => (prev.amount < current.amount) ? prev : current);
    }

    return {
      totalDeposits,
      totalExpenses,
      remaining: totalDeposits - totalExpenses,
      avgCost: activeTrip.people.length > 0 ? totalExpenses / activeTrip.people.length : 0,
      maxCost: maxExpense ? maxExpense.amount : 0,
      minCost: minExpense ? minExpense.amount : 0,
      maxExpenseName: maxExpense ? maxExpense.item : '-',
      minExpenseName: minExpense ? minExpense.item : '-'
    };
  }, [activeTrip]);

  // --- HELPER: Format Date ---
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- HANDLERS ---
  const handleAddClick = (type: 'person' | 'expense' | 'trip' | 'profile') => { setEditingItem(null); setModalType(type); setModalOpen(true); };
  const handleEditItem = (type: 'person' | 'expense' | 'trip', item: any) => {
    setEditingItem(item);
    const finalType = (type === 'trip' && item.type === 'bulk') ? 'bulk_trip' : type;
    setModalType(finalType as any);
    setModalOpen(true);
  };
  const handleDeleteItem = (type: 'person' | 'expense' | 'trip', id: number) => { setItemToDelete({ type, id }); };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = () => {
    if (!activeTrip) return;
    setIsToggleModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!activeTrip) return;
    const newStatus: 'active' | 'completed' = activeTrip.status === 'completed' ? 'active' : 'completed';
    const updatedTrip = { ...activeTrip, status: newStatus };

    // Optimistic Update
    setTrips(trips.map(t => t.id === activeTripId ? updatedTrip : t));
    setIsToggleModalOpen(false);

    // API Update
    const res = await fetch(`/api/trips/${activeTrip.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTrip)
    });

    if (res.ok && newStatus === 'completed') {
      const remainingOngoing = trips.filter(t => t.id !== activeTrip.id && t.type !== 'bulk' && t.status !== 'completed');
      if (remainingOngoing.length === 0) {
        setActiveTripId(0);
        router.push('/dashboard');
      } else {
        setActiveTripId(remainingOngoing[0].id);
        router.push(`/dashboard?tripId=${remainingOngoing[0].id}`);
      }
    }
  };

  const handleExport = () => {
    if (!activeTrip) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    const dateRange = activeTrip.startDate ? `(${activeTrip.startDate} to ${activeTrip.endDate || '...'})` : '';
    csvContent += `TRIP REPORT: ${activeTrip.name} ${dateRange} (${activeTrip.currency})\n\nSUMMARY\nTotal Deposits,${stats.totalDeposits}\nTotal Expenses,${stats.totalExpenses}\nRemaining Fund,${stats.remaining}\nCost Per Person,${Math.round(stats.avgCost)}\n\nPEOPLE & DEPOSITS\nName,Deposit,Status,Amount\n`;
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

  const saveData = async (data: any) => {
    if (modalType === 'trip') {
      if (editingItem) {
        // Update Trip Logic
        const updatedTrip = { ...editingItem, name: data.name, startDate: data.startDate, endDate: data.endDate };
        // Optimistic Update
        const updatedTrips = trips.map(t => t.id === editingItem.id ? updatedTrip : t);
        setTrips(updatedTrips);

        // API Update
        await fetch(`/api/trips/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTrip)
        });
      } else {
        // Create Trip Logic
        const newTripData = { id: Date.now(), name: data.name, currency: "BDT", startDate: data.startDate, endDate: data.endDate, people: [], expenses: [] };

        // Optimistic
        setTrips([...trips, newTripData]);
        setActiveTripId(newTripData.id);

        // API Call
        const res = await fetch("/api/trips", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTripData)
        });
        if (res.ok) {
          const serverTrip = await res.json();
          // Note: If server assigns a different ID (e.g. valid ObjectId instead of date), we should update it.
          // But here we rely on Date.now() ID passing through.
        }
      }
    } else if (modalType === 'profile') {
      // Handle Profile Update
      try {
        await authClient.updateUser({
          name: data.name,
          image: data.image
        });
      } catch (error) {
        console.error("Failed to update profile", error);
      }
    } else {
      // Handle People or Expenses
      if (!activeTrip) return;

      let updatedTrip = { ...activeTrip };

      if (modalType === 'person') {
        if (editingItem) {
          updatedTrip.people = updatedTrip.people.map(p => p.id === editingItem.id ? { ...p, ...data } : p);
        } else {
          updatedTrip.people = [...updatedTrip.people, { id: Date.now(), ...data }];
        }
      } else {
        if (editingItem) {
          updatedTrip.expenses = updatedTrip.expenses.map(e => e.id === editingItem.id ? { ...e, ...data } : e);
        } else {
          updatedTrip.expenses = [...updatedTrip.expenses, { id: Date.now(), ...data }];
        }
      }

      // Optimistic Update
      setTrips(trips.map(t => t.id === activeTripId ? updatedTrip : t));

      // API Update
      await fetch(`/api/trips/${activeTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrip)
      });
    }
    setEditingItem(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'trip') {
      // Optimistic
      const newTrips = trips.filter(t => t.id !== itemToDelete.id);
      setTrips(newTrips);
      if (activeTripId === itemToDelete.id) setActiveTripId(newTrips[0]?.id || 0);

      // API
      await fetch(`/api/trips/${itemToDelete.id}`, { method: 'DELETE' });
    } else {
      let updatedTrip = { ...activeTrip } as Trip;
      if (itemToDelete.type === 'person') {
        updatedTrip.people = updatedTrip.people.filter(p => p.id !== itemToDelete.id);
      } else {
        updatedTrip.expenses = updatedTrip.expenses.filter(e => e.id !== itemToDelete.id);
      }

      setTrips(trips.map(t => t.id === activeTripId ? updatedTrip : t));

      // API Update
      await fetch(`/api/trips/${activeTrip?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrip)
      });
    }
    setItemToDelete(null);
  };

  // if (isPending) return null; 
  // if (!session) return null;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-gray-900">
      <style>{globalStyles}</style>
      <AddModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} onSave={saveData} initialData={editingItem} />
      <DeleteConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} title={itemToDelete?.type === 'trip' ? "Delete Trip?" : "Are you sure?"} message={itemToDelete?.type === 'trip' ? "This will delete the trip and all data." : undefined} />
      <ConfirmModal
        isOpen={isToggleModalOpen}
        onClose={() => setIsToggleModalOpen(false)}
        onConfirm={confirmToggleStatus}
        title={activeTrip?.status === 'completed' ? "Resume Trip?" : "End Trip?"}
        message={activeTrip?.status === 'completed'
          ? "This will reopen the trip for new expenses and modifications."
          : "This will mark the trip as completed and lock it from new expenses."}
        confirmText={activeTrip?.status === 'completed' ? "Resume Journey" : "Complete Trip"}
        variant={activeTrip?.status === 'completed' ? 'success' : 'warning'}
      />

      {/* --- BACK TO TOP BUTTON --- */}
      <button
        onClick={handleScrollToTop}
        className={`fixed bottom-8 right-8 bg-[#10B17D] text-white p-3 rounded-full shadow-lg hover:bg-[#0D8F65] hover:scale-110 hover:shadow-xl cursor-pointer transition-all duration-300 z-50 transform ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
      >
        <ArrowUp size={24} />
      </button>

      <Sidebar
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={(id) => {
          const trip = trips.find(t => t.id === id);
          if (trip?.type === 'bulk') {
            router.push(`/bulk_calculation?tripId=${id}`);
          } else {
            setActiveTripId(id);
          }
        }}
        onEditTrip={(trip: Trip) => handleEditItem('trip', trip)}
        onDeleteTrip={(trip: Trip) => handleDeleteItem('trip', trip.id)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={session?.user}
        onEditProfile={() => {
          setEditingItem({ name: session?.user?.name, image: session?.user?.image });
          setModalType('profile');
          setModalOpen(true);
        }}
        onLogout={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/")
            }
          } as any);
        }}
      />

      <main className="md:ml-80 flex-1 min-w-0">
        <div className="max-w-[1600px] mx-auto p-4 md:p-10 space-y-10">

          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl"><Menu size={24} /></button>
              <div className="flex flex-col gap-1.5 min-w-0">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight truncate">
                  {activeTrip ? activeTrip.name : "Dashboard"}
                </h2>
                {activeTrip?.startDate && (
                  <div className="flex">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-gray-400 uppercase tracking-tight">
                      {formatDate(activeTrip.startDate)}
                      {activeTrip.endDate ? ` — ${formatDate(activeTrip.endDate)}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeTrip && (
                <>
                  <button
                    onClick={handleToggleStatus}
                    className={`cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${activeTrip.status === 'completed'
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                      }`}
                  >
                    {activeTrip.status === 'completed' ? <Unlock size={18} /> : <Lock size={18} />}
                    <span>{activeTrip.status === 'completed' ? 'Resume Trip' : 'End Trip'}</span>
                  </button>
                  <button onClick={handleExport} className="cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:shadow-sm transition-all active:scale-95">
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                </>
              )}
              <button
                onClick={() => handleAddClick('trip')}
                className="cursor-pointer flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#10B17D] text-white rounded-xl text-sm font-bold hover:bg-[#0D8F65] hover:shadow-lg shadow-[#10B17D]/20 transition-all active:scale-95"
              >
                <Plus size={18} />
                <span>New Trip</span>
              </button>
            </div>
          </header>

          {activeTrip ? (
            <>
              {/* Summary Grid */}
              <SummaryGrid stats={stats} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <PeopleCard
                    people={activeTrip.people}
                    onAdd={activeTrip.status === 'completed' ? undefined : () => handleAddClick('person')}
                    onEdit={activeTrip.status === 'completed' ? undefined : (p) => handleEditItem('person', p)}
                    onDelete={activeTrip.status === 'completed' ? undefined : (id) => handleDeleteItem('person', id)}
                  />
                  <ExpensesCard
                    expenses={activeTrip.expenses}
                    onAdd={activeTrip.status === 'completed' ? undefined : () => handleAddClick('expense')}
                    onEdit={activeTrip.status === 'completed' ? undefined : (e) => handleEditItem('expense', e)}
                    onDelete={activeTrip.status === 'completed' ? undefined : (id) => handleDeleteItem('expense', id)}
                  />
                </div>
                <div className="space-y-8">
                  <BalancesCard people={activeTrip.people} avgCost={stats.avgCost} />
                </div>
              </div>

              {/* Charts Section - Now at the bottom */}
              <DashboardCharts trip={activeTrip} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-12 relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10B17D]/5 rounded-full blur-3xl group-hover:bg-[#10B17D]/10 transition-all duration-500" />

              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <MapIcon size={48} className="text-gray-200 group-hover:text-[#10B17D] transition-colors duration-500" />
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">No Ongoing Trips Found</h3>
                <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
                  Every great journey starts with a single plan. Create your first trip to start tracking expenses and splitting costs with friends.
                </p>
              </div>

              <button
                onClick={() => handleAddClick('trip')}
                className="mt-10 cursor-pointer flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-[#10B17D] shadow-xl hover:shadow-[#10B17D]/20 transition-all active:scale-95 group/btn"
              >
                <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                <span>Start New Journey</span>
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}