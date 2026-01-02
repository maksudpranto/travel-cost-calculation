// components/PeopleCard.tsx
import React from 'react';
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Person } from '../types';

interface PeopleCardProps {
  people: Person[];
  onAdd: () => void;
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

export const PeopleCard = ({ people, onAdd, onEdit, onDelete }: PeopleCardProps) => {
  return (
    // MODERN CONTAINER: Soft shadow, cleaner border, more rounded
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">People</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:shadow-md"
        >
          <Plus size={18} /> Add People
        </button>
      </div>

      <div className="space-y-2">
        {people.map((person) => (
          <div key={person.id} className="flex items-center justify-between group p-2 rounded-xl hover:bg-gray-50/80 transition-colors">

            {/* LEFT: Avatar + Name */}
            <div className="flex items-center gap-3">
              {/* Modern Gradient Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {person.name.charAt(0)}
              </div>
              <span className="font-semibold text-gray-900">{person.name}</span>
            </div>

            {/* RIGHT: Amount + Actions */}
            <div className="flex items-center gap-3">
              {/* Clean Amount Badge */}
              <div className="font-bold tabular-nums text-sm text-gray-700 bg-white border border-gray-200/60 px-3 py-1.5 rounded-lg w-28 text-right shadow-sm">
                ৳{person.deposit.toLocaleString()}
              </div>

              {/* Action Buttons (Subtle until hovered) */}
              <div className="flex gap-1">
                <button onClick={() => onEdit(person)} className="text-gray-300 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDelete(person.id)} className="text-gray-300 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition">
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