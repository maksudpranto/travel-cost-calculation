import React, { useState, useEffect, useRef } from 'react';
import { X, User, FileText, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'person' | 'expense' | 'trip' | 'profile' | 'bulk_trip';
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
        if (inputRef.current.showPicker) {
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
      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{label}</label>

      <div
        onClick={handleDivClick}
        className="relative group w-full cursor-pointer"
      >
        {/* VISUAL LAYER */}
        <div className={`
          flex items-center justify-between w-full px-6 h-16
          bg-white border rounded-[24px] transition-all duration-300
          ${isSelected ? 'border-[#10B17D] text-gray-900 ring-4 ring-[#10B17D]/10' : 'border-[#10B17D]/20 text-gray-400 hover:border-[#10B17D]/50'}
        `}>
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-all duration-500 bg-gradient-to-br from-[#10B17D] to-[#0D8F65] text-white shadow-lg shadow-[#10B17D]/20 group-hover:scale-110`}>
              <CalendarIcon size={20} strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold">{displayDate}</span>
          </div>
          <ChevronDown size={18} className={`transition-transform duration-300 ${isSelected ? 'text-[#10B17D]' : 'text-gray-300'}`} />
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
  const [touristCount, setTouristCount] = useState('');
  const [feePerPerson, setFeePerPerson] = useState('');

  // For Profile
  const [imageUrl, setImageUrl] = useState('');

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
      } else if (type === 'profile') {
        setName(initialData.name || '');
        setImageUrl(initialData.image || '');
      } else if (type === 'bulk_trip') {
        setName(initialData.name || '');
        setTouristCount(initialData.touristCount?.toString() || '');
        setFeePerPerson(initialData.feePerPerson?.toString() || '');
      }
    } else {
      setName('');
      setDeposit('');
      setItem('');
      setDescription('');
      setAmount('');
      setStartDate('');
      setEndDate('');
      setImageUrl('');
      setTouristCount('');
      setFeePerPerson('');
    }
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'person') {
      onSave({ name, deposit: Number(deposit) });
    } else if (type === 'trip') {
      onSave({ name, startDate, endDate });
    } else if (type === 'profile') {
      onSave({ name, image: imageUrl });
    } else if (type === 'bulk_trip') {
      onSave({ name, touristCount: Number(touristCount), feePerPerson: Number(feePerPerson) });
    } else {
      onSave({ item, description, amount: Number(amount) });
    }
    onClose();
  };

  const inputStyle = "w-full h-16 px-6 bg-white border border-[#10B17D]/20 rounded-[24px] text-gray-900 placeholder-gray-400 font-bold text-base focus:outline-none focus:border-[#10B17D] focus:ring-4 focus:ring-[#10B17D]/10 hover:border-[#10B17D]/50 transition-all duration-300";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 z-50 transition-all duration-500">
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

      <div className="bg-white rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 sm:zoom-in duration-500 border border-white/40">

        {/* Header */}
        <div className="px-12 pt-12 pb-8 flex justify-between items-start relative">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
              {type === 'profile' ? 'Profile' : initialData ? 'Modify' : 'Create'}<span className="text-[#10B17D]">.</span>
            </h3>
            <p className="text-[10px] font-black text-[#10B17D] uppercase tracking-[0.3em] opacity-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B17D] animate-pulse"></span>
              {type === 'person' ? 'Active Participant' : type === 'expense' ? 'New Transaction' : type === 'trip' ? 'Planning Journey' : type === 'bulk_trip' ? 'New Calculation' : 'Personal Data'}
            </p>
          </div>
          <button onClick={onClose} className="cursor-pointer text-gray-300 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-2xl transition-all duration-300 active:scale-90">
            <X size={28} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-12 pb-12 space-y-8">

          {/* --- PERSON FORM --- */}
          {type === 'person' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-6 top-5 text-gray-300 group-focus-within:text-[#10B17D] transition-colors">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                  <input required type="text" placeholder="e.g. Pranto" value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Initial Deposit</label>
                <div className="relative group">
                  <div className="absolute left-6 top-5 text-2xl font-black text-gray-300 group-focus-within:text-[#10B17D] transition-colors leading-none">৳</div>
                  <input required type="number" placeholder="0.00" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                </div>
              </div>
            </div>
          )}

          {/* --- EXPENSE FORM --- */}
          {type === 'expense' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Item Title</label>
                <div className="relative group">
                  <div className="absolute left-6 top-5 text-gray-300 group-focus-within:text-[#10B17D] transition-colors">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <input required type="text" placeholder="e.g. Dinner, Transport" value={item} onChange={(e) => setItem(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Total Cost</label>
                <div className="relative group">
                  <div className="absolute left-6 top-5 text-2xl font-black text-gray-300 group-focus-within:text-[#10B17D] transition-colors leading-none">৳</div>
                  <input required type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Notes & Description</label>
                <textarea placeholder="Any specific details about this expense?" value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputStyle} resize-none h-32 p-6`} />
              </div>
            </div>
          )}

          {/* --- TRIP FORM --- */}
          {type === 'trip' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Journey Title</label>
                <input required type="text" placeholder="Where are we adventure bound?" value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} h-16 px-6`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ModernDatePicker
                  label="Begins"
                  value={startDate}
                  onChange={setStartDate}
                />
                <ModernDatePicker
                  label="Conclusion"
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
            </div>
          )}

          {/* --- PROFILE FORM --- */}
          {type === 'profile' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Public Name</label>
                <div className="relative group">
                  <div className="absolute left-6 top-5 text-gray-300 group-focus-within:text-[#10B17D] transition-colors">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                  <input required type="text" placeholder="Update your public name" value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                </div>
              </div>
            </div>
          )}

          {/* --- BULK TRIP FORM --- */}
          {type === 'bulk_trip' && (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Tour Name</label>
                <div className="relative group">
                  <div className="absolute left-6 top-5 text-gray-300 group-focus-within:text-[#10B17D] transition-colors">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <input required type="text" placeholder="e.g. Sajek Valley Tour" value={name} onChange={(e) => setName(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">No. of People</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-5 text-gray-300 group-focus-within:text-[#10B17D] transition-colors">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <input required type="number" min="1" placeholder="0" value={touristCount} onChange={(e) => setTouristCount(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Event Fee</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-5 text-2xl font-black text-gray-300 group-focus-within:text-[#10B17D] transition-colors leading-none">৳</div>
                    <input required type="number" min="0" placeholder="0.00" value={feePerPerson} onChange={(e) => setFeePerPerson(e.target.value)} className={`${inputStyle} h-16 pl-16`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-50">
            <button type="button" onClick={onClose} className="cursor-pointer flex-1 h-16 bg-white border-2 border-gray-100 text-gray-400 font-black text-sm rounded-[24px] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all duration-300 active:scale-95">
              Discard
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 h-16 bg-[#10B17D] text-white font-black text-sm rounded-[24px] hover:bg-[#0D8F65] hover:scale-[1.02] transition-all duration-300 active:scale-95 flex items-center justify-center"
            >
              {initialData ? 'Save Changes' : 'Create Now'}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-50 transition-all duration-500">
      <div className="bg-white rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-lg p-12 animate-in fade-in zoom-in duration-500 border border-white/40">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[28px] flex items-center justify-center mb-8 shadow-sm">
          <X size={40} strokeWidth={3} />
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">{title}</h3>
        <p className="text-base font-bold text-gray-400 mb-12 leading-relaxed">{message || "This item will be permanently removed from your journey records. This action cannot be undone."}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onClose} className="cursor-pointer flex-1 h-16 bg-white border-2 border-gray-100 text-gray-400 font-black text-sm rounded-[24px] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all duration-300 active:scale-95">
            Keep It
          </button>
          <button onClick={onConfirm} className="cursor-pointer flex-1 h-16 bg-rose-500 text-white font-black text-sm rounded-[24px] hover:bg-rose-600 transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/10">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant = 'danger' }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'warning';
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      bg: 'bg-rose-50',
      text: 'text-rose-500',
      button: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10'
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-500',
      button: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-500',
      button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'
    }
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-50 transition-all duration-500">
      <div className="bg-white rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-lg p-12 animate-in fade-in zoom-in duration-500 border border-white/40">
        <div className={`w-20 h-20 ${style.bg} ${style.text} rounded-[28px] flex items-center justify-center mb-8 shadow-sm`}>
          <FileText size={40} strokeWidth={3} />
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">{title}</h3>
        <p className="text-base font-bold text-gray-400 mb-12 leading-relaxed">{message}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onClose} className="cursor-pointer flex-1 h-16 bg-white border-2 border-gray-100 text-gray-400 font-black text-sm rounded-[24px] hover:bg-gray-50 hover:text-gray-600 transition-all duration-300">
            {cancelText || "Cancel"}
          </button>
          <button onClick={onConfirm} className={`cursor-pointer flex-1 h-16 ${style.button} text-white font-black text-sm rounded-[24px] transition-all duration-300 shadow-lg`}>
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};