// components/ExpensesCard.tsx
import React from 'react';
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { Expense } from '../types';

interface ExpensesCardProps {
  expenses: Expense[];
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpensesCard = ({ expenses, onAdd, onEdit, onDelete }: ExpensesCardProps) => {
  return (
    // MODERN CONTAINER: Matches PeopleCard style
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Expenses</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow-md"
        >
          <Plus size={14} /> Add Expense
        </button>
      </div>

      <div className="space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50/80 transition-colors">

            {/* LEFT: Icon + Text */}
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Expense Icon (Rose/Orange Gradient to signify spending) */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <ShoppingBag size={18} />
              </div>

              <div className="flex flex-col overflow-hidden">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{expense.item}</h4>
                {expense.description && (
                  <p className="text-xs text-gray-400 truncate max-w-[150px] sm:max-w-[200px]">
                    {expense.description}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: Amount + Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Clean Amount Badge */}
              <div className="font-bold tabular-nums text-sm text-gray-700 bg-white border border-gray-200/60 px-3 py-1.5 rounded-lg min-w-[80px] text-right shadow-sm">
                ৳{expense.amount.toLocaleString()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <button onClick={() => onEdit(expense)} className="text-gray-300 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDelete(expense.id)} className="text-gray-300 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};