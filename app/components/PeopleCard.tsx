import React from 'react';
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Person } from '../type';

interface PeopleCardProps {
  people: Person[];
  onAdd: () => void;
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

const scrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
`;

export const PeopleCard = ({ people, onAdd, onEdit, onDelete }: PeopleCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 w-full">
      <style>{scrollbarStyle}</style>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">People</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-sm font-medium bg-[#41644A] text-white hover:bg-[#2e4a34] px-6 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {people.map((person, index) => (
          <div key={person.id} className="flex items-center justify-between group p-2 rounded-xl hover:bg-gray-50/80 transition-colors">

            {/* LEFT: Serial + Avatar + Name */}
            <div className="flex items-center gap-3">
              {/* SERIAL NUMBER */}
              <span className="text-gray-400 text-xs font-mono font-bold w-6">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {person.name.charAt(0)}
              </div>
              <span className="font-semibold text-gray-900">{person.name}</span>
            </div>

            {/* RIGHT: Amount + Actions */}
            <div className="flex items-center gap-3">
              <div className="font-bold tabular-nums text-sm text-gray-700 bg-gray-100/50 border border-gray-200/50 px-3 py-1.5 rounded-lg w-28 text-right backdrop-blur-sm">
                ৳{person.deposit.toLocaleString()}
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(person)} className="text-gray-300 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition"><Pencil size={16} /></button>
                <button onClick={() => onDelete(person.id)} className="text-gray-300 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};