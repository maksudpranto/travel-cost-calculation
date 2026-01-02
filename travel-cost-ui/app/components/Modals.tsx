// app/components/Modals.tsx
"use client"; // Required for interactivity
import React, { useState, useEffect } from 'react';
import { X, User, Map, AlertTriangle } from "lucide-react";

export const AddModal = ({
  isOpen,
  onClose,
  type,
  onSave,
  initialData
}: {
  isOpen: boolean;
  onClose: () => void;
  type: 'person' | 'expense' | 'trip';
  onSave: (data: any) => void;
  initialData?: any;
}) => {
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState("");
  const [item, setItem] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (isOpen && initialData && type === 'trip') {
      setName(initialData.name);
    } else if (!isOpen) {
      setName(""); setDeposit(""); setItem(""); setDesc(""); setAmount("");
    }
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
             <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
                <div className="relative">
                  <Map className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input required type="text" placeholder="e.g., Saint Martin 2024" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {type === 'person' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input required type="text" placeholder="Name" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span>
                  <input required type="number" min="0" placeholder="0" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={deposit} onChange={e => setDeposit(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {type === 'expense' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <input required type="text" placeholder="Expense Name" className="w-full px-4 py-2 border rounded-lg" value={item} onChange={e => setItem(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" placeholder="Optional" className="w-full px-4 py-2 border rounded-lg" value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span>
                  <input required type="number" min="0" placeholder="0" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {initialData && type === 'trip' ? 'Update Trip' : (type === 'trip' ? 'Create Trip' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. This item will be permanently removed."
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertTriangle size={24} />
        </div>
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