import React, { useState, useEffect, useRef } from 'react';
import { X, User, FileText, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

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

// --- HELPER: Internal Modern Date Picker Component ---
const ModernDatePicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Format displayed date
  const displayDate = value
    ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select Date';

  const isSelected = !!value;

  // This function forces the calendar to open
  const handleDivClick = () => {
    try {
      if (inputRef.current) {
        if (typeof inputRef.current.showPicker === 'function') {
          inputRef.current.showPicker(); // Modern Browsers
        } else {
          inputRef.current.focus(); // Fallback
        }
      }
    } catch (error) {
      console.log("Picker error", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>

      {/* 1. onClick triggers handleDivClick -> opens calendar
         2. relative group -> creates the container
      */}
      <div
        onClick={handleDivClick}
        className="relative group w-full cursor-pointer"
      >
        {/* VISUAL LAYER */}
        <div className={`
          flex items-center justify-between w-full px-4 py-3
          bg-gray-50 border rounded-xl transition-all duration-200
          ${isSelected ? 'border-gray-300 text-gray-900 bg-white' : 'border-gray-200 text-gray-400'}
          group-hover:border-[#41644A] group-hover:bg-white group-hover:shadow-sm
        `}>
          <div className="flex items-center gap-3">
            <CalendarIcon size={18} className={isSelected ? 'text-[#41644A]' : 'text-gray-400'} />
            <span className="text-sm font-medium">{displayDate}</span>
          </div>
          <ChevronDown size={16} className="text-gray-400 opacity-50" />
        </div>

        {/* INVISIBLE INPUT LAYER */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
};

export const AddModal = ({ isOpen, onClose, type, onSave, initialData }: AddModalProps) => {
  const [name, setName] = useState('');
  const [deposit, setDeposit] = useState('');
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

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
      onSave({ name, startDate, endDate });
    } else {
      onSave({ item, description, amount: Number(amount) });
    }
    onClose();
  };

  const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#41644A] transition-colors";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">

      {/* CSS Hack to ensure the calendar click area is maximized on WebKit browsers */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit' : 'Add'} {type === 'person' ? 'Person' : type === 'expense' ? 'Expense' : 'Trip'}
          </h3>
          <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* --- PERSON FORM --- */}
          {type === 'person' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deposit Amount</label>
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Item Name</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input required type="text" placeholder="What was bought?" value={item} onChange={(e) => setItem(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cost</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold text-lg">৳</span>
                  <input required type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputStyle} pl-11`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea placeholder="Details..." value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputStyle} resize-none h-24`} />
              </div>
            </>
          )}

          {/* --- TRIP FORM --- */}
          {type === 'trip' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trip Name</label>
                <input required type="text" placeholder="e.g. Cox's Bazar 2024" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <ModernDatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                />
                <ModernDatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="cursor-pointer flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 hover:shadow-inner active:scale-95 transition-all">Cancel</button>
            <button
              type="submit"
              className="cursor-pointer flex-1 px-4 py-3 bg-[#41644A] text-white font-bold rounded-xl hover:bg-[#2e4a34] hover:shadow-lg active:scale-95 transition-all"
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
          <button onClick={onClose} className="cursor-pointer flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 hover:shadow-inner active:scale-95 transition-all">Cancel</button>
          <button onClick={onConfirm} className="cursor-pointer flex-1 px-4 py-2 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 hover:shadow-lg active:scale-95 transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
};