// components/BalancesCard.tsx
import React from 'react';
import { Person } from '../types';

interface BalancesCardProps {
  people: Person[];
  avgCost: number;
}

export const BalancesCard = ({ people, avgCost }: BalancesCardProps) => {
  return (
    // MODERN CONTAINER
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Settlement</h3>

      <div className="space-y-3">
        {people.map((person) => {
          const balance = person.deposit - avgCost;
          const isRefund = balance > 0;
          const isSettled = Math.abs(balance) < 1; // Tolerance for small decimals

          return (
            <div key={person.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-50/50 transition-colors">

              {/* LEFT: Avatar + Name (Matches PeopleCard style) */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {person.name.charAt(0)}
                </div>
                <span className="font-semibold text-gray-900">{person.name}</span>
              </div>

              {/* RIGHT: Status Text & Amount */}
              {isSettled ? (
                 <span className="text-gray-400 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                   All Settled
                 </span>
              ) : (
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isRefund ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isRefund ? 'Gets back' : 'Owes'}
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {isRefund ? '+' : ''}৳{Math.round(Math.abs(balance)).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};