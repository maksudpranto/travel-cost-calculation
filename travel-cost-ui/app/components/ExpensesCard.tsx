// components/ExpensesCard.tsx
import React from 'react';
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Expense } from '../types';

interface ExpensesCardProps {
  expenses: Expense[];
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpensesCard = ({ expenses, onAdd, onEdit, onDelete }: ExpensesCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Expenses in Tours</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-md shadow-sm transition">
          <Plus size={18} /> Add Expense
        </button>
      </div>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between group border-b border-gray-50 pb-3 last:border-0 last:pb-0 h-14">
            <div className="flex-1 mr-4">
              <h4 className="font-bold text-gray-900 text-sm">{expense.item}</h4>
              {expense.description && <p className="text-xs text-gray-400 truncate">{expense.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <div className="font-medium tabular-nums text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm w-28 text-right mr-2">
                {expense.amount.toLocaleString()}
              </div>
              <button onClick={() => onEdit(expense)} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded transition">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(expense.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};