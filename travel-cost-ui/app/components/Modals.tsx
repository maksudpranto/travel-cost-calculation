import React, { useState, useEffect } from 'react';
import { X, User, FileText, Calendar as CalendarIcon } from 'lucide-react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'person' | 'expense' | 'trip';
  onSave: (data: any) => void;
  initialData?: any;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
}

export const AddModal = ({ isOpen, onClose, type, onSave, initialData }: AddModalProps) => {
  const [name, setName] = useState('');
  const [deposit, setDeposit] = useState('');
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  // --- NEW DATE STATES ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (initialData) {
      if (type === 'person') {
        setName(initialData.name);
        setDeposit(initialData.deposit.toString());
      } else if (type === 'expense') {
        setItem(initialData.item);
        setDescription(initialData.description || '');
        setAmount(initialData.amount.toString());
      } else if (type === 'trip') {
        setName(initialData.name);
        // Load dates if they exist
        setStartDate(initialData.startDate || '');
        setEndDate(initialData.endDate || '');
      }
    } else {
      setName('');
      setDeposit('');
      setItem('');
      setDescription('');
      setAmount('');
      setStartDate('');
      setEndDate('');
    }
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'person') {
      onSave({ name, deposit: Number(deposit) });
    } else if (type === 'trip') {
      // Save dates with trip data
      onSave({ name, startDate, endDate });
    } else {
      onSave({ item, description, amount: Number(amount) });
    }
    onClose();
  };

  const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData ? 'Edit' : 'Add'} {type === 'person' ? 'Person' : type === 'expense' ? 'Expense' : 'Trip'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* --- PERSON FORM --- */}
          {type === 'person' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deposit Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold text-lg">৳</span>
                  <input required type="number" placeholder="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
            </>
          )}

          {/* --- EXPENSE FORM --- */}
          {type === 'expense' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Item Name</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input required type="text" placeholder="What was bought?" value={item} onChange={(e) => setItem(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cost</label>
                <div className="relative">
                   <span className="absolute left-4 top-3 text-gray-400 font-bold text-lg">৳</span>
                  <input required type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                <textarea placeholder="Details..." value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputStyle} resize-none h-24`} />
              </div>
            </>
          )}

           {/* --- TRIP FORM (Updated with Dates) --- */}
           {type === 'trip' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Trip Name</label>
                <input required type="text" placeholder="e.g. Cox's Bazar 2024" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Start Date (Optional)</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`${inputStyle} pl-11 text-sm`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">End Date (Optional)</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`${inputStyle} pl-11 text-sm`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#41644A] text-white font-medium rounded-xl hover:bg-[#2e4a34] transition-all"
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message || "Are you sure you want to delete this? This action cannot be undone."}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
};