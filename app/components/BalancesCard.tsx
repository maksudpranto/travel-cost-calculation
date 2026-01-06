import React from 'react';
import { Person } from '../type';

interface BalancesCardProps {
  people: Person[];
  avgCost: number;
}

// 1. CSS for the scrollbar
const scrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
`;

export const BalancesCard = ({ people, avgCost }: BalancesCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 w-full">
      <style>{scrollbarStyle}</style>
      <h3 className="text-lg font-bold text-gray-800 mb-6">Settlement</h3>

      {/* 2. SCROLL CONTAINER: max-h-[400px], overflow-y-auto */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {people.map((person, index) => {
          const balance = person.deposit - avgCost;
          const isRefund = balance > 0;
          const isSettled = Math.abs(balance) < 1;

          return (
            <div key={person.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-50/50 transition-colors">

              {/* LEFT: Serial + Avatar + Name */}
              <div className="flex items-center gap-3">
                {/* 3. SERIAL NUMBER */}
                <span className="text-gray-400 text-xs font-mono font-bold w-6 shrink-0">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {person.name.charAt(0)}
                </div>
                <span className="font-semibold text-gray-900">{person.name}</span>
              </div>

              {/* RIGHT: Status & Amount */}
              {isSettled ? (
                 <span className="text-gray-400 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">All Settled</span>
              ) : (
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isRefund ? 'text-emerald-600' : 'text-rose-500'}`}>{isRefund ? 'Gets back' : 'Owes'}</p>
                  <p className="font-bold text-gray-900 text-sm">{isRefund ? '+' : ''}৳{Math.round(Math.abs(balance)).toLocaleString()}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};