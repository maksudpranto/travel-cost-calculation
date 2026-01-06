import React from 'react';
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { Expense } from '../type';

interface ExpensesCardProps {
  expenses: Expense[];
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

// 1. CSS for the scrollbar
const scrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
`;

export const ExpensesCard = ({ expenses, onAdd, onEdit, onDelete }: ExpensesCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 w-full">
      <style>{scrollbarStyle}</style>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Expenses</h3>
        <button
          onClick={onAdd}
          className="cursor-pointer flex items-center gap-2 text-sm font-medium bg-[#41644A] text-white hover:bg-[#2e4a34] px-6 py-2 rounded-lg shadow-sm transition-all hover:shadow-lg active:scale-95"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* 2. SCROLL CONTAINER: max-h-[400px], overflow-y-auto */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {expenses.map((expense, index) => (
          <div key={expense.id} className="flex items-center justify-between group p-2 rounded-xl hover:bg-gray-50/80 transition-colors">

            {/* LEFT: Serial + Icon + Text */}
            <div className="flex items-center gap-3 overflow-hidden">
              {/* 3. SERIAL NUMBER */}
              <span className="text-gray-400 text-xs font-mono font-bold w-6 shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <ShoppingBag size={18} />
              </div>
              <div className="flex flex-col overflow-hidden justify-center">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{expense.item}</h4>
                {expense.description && <p className="text-xs text-gray-400 truncate max-w-[150px] sm:max-w-[200px]">{expense.description}</p>}
              </div>
            </div>

            {/* RIGHT: Amount + Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="font-bold tabular-nums text-sm text-gray-700 bg-gray-100/50 border border-gray-200/50 px-3 py-1.5 rounded-lg min-w-[80px] text-right backdrop-blur-sm">
                ৳{expense.amount.toLocaleString()}
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(expense)} className="cursor-pointer text-gray-300 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 hover:shadow-md active:scale-90 transition-all"><Pencil size={16} /></button>
                <button onClick={() => onDelete(expense.id)} className="cursor-pointer text-gray-300 hover:text-red-600 p-2 rounded-md hover:bg-red-50 hover:shadow-md active:scale-90 transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};