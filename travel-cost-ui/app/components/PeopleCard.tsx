// components/PeopleCard.tsx
import React from 'react';
import { Plus, Pencil, Trash2 } from "lucide-react";
// Assuming your types are in a file named types.ts in the parent folder
import { Trip, Person } from '../types';

interface PeopleCardProps {
  people: Person[];
  onAdd: () => void;
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

export const PeopleCard = ({ people, onAdd, onEdit, onDelete }: PeopleCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">People</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-md shadow-sm transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {people.map((person) => (
          <div key={person.id} className="flex items-center justify-between group h-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                {person.name.charAt(0)}
              </div>
              <span className="font-medium">{person.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-medium tabular-nums text-sm text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm w-28 text-right">
                {person.deposit.toLocaleString()}
              </div>
              <button onClick={() => onEdit(person)} className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded transition">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(person.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};