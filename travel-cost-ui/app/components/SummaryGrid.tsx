// components/SummaryGrid.tsx
import React from 'react';
import { StatCard } from './StatCard'; // Make sure this path is correct

interface SummaryGridProps {
  stats: {
    totalDeposits: number;
    totalExpenses: number;
    remaining: number;
    avgCost: number;
  };
}

export const SummaryGrid = ({ stats }: SummaryGridProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Cost Summary</h3>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <StatCard label="Total Deposits" value={stats.totalDeposits.toLocaleString()} />
        <StatCard label="Total Expenses" value={stats.totalExpenses.toLocaleString()} />
        <StatCard label="Remaining Fund" value={stats.remaining.toLocaleString()} />
        <StatCard label="Average Cost" value={Math.round(stats.avgCost).toLocaleString()} />
      </div>
    </div>
  );
};