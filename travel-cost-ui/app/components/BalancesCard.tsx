// components/BalancesCard.tsx
import React from 'react';
import { Person } from '../types';

interface BalancesCardProps {
  people: Person[];
  avgCost: number;
}

export const BalancesCard = ({ people, avgCost }: BalancesCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Balances</h3>
      <div className="space-y-4">
        {people.map((person) => {
          const balance = person.deposit - avgCost;
          const isRefund = balance > 0;
          const isSettled = balance === 0;

          return (
            <div key={person.id} className="flex justify-between items-center text-sm">

              {/* --- UPDATED STYLE START: Avatar + Name --- */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                   {person.name.charAt(0)}
                </div>
                <span className="text-gray-900 font-medium">{person.name}</span>
              </div>
              {/* --- UPDATED STYLE END --- */}

              {/* Right Side: Status & Numbers */}
              {isSettled ? (
                <span className="text-gray-400 text-xs">Settled</span>
              ) : (
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isRefund ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isRefund ? 'Refund' : 'Needs to add'}
                  </span>
                  <span className="font-bold text-gray-900 w-12 text-right">
                    {isRefund ? '+' : ''}{Math.round(balance).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};