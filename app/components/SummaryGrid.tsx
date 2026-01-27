import React from 'react';
import { Wallet, Receipt, Coins, Users, LucideIcon } from "lucide-react";

interface SummaryGridProps {
  stats: {
    totalDeposits: number;
    totalExpenses: number;
    remaining: number;
    avgCost: number;
    maxCost: number;
    minCost: number;
    maxExpenseName?: string;
    minExpenseName?: string;
  };
}

const StatItem = ({
  label,
  value,
  subLabel,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  subLabel?: string;
  icon: LucideIcon;
  color: string;
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className={`p-2 rounded-xl sm:p-2.5 bg-${color}-50 text-${color}-600 transition-all duration-300 shadow-sm border border-${color}-100/50`}>
        <Icon size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
      </div>
    </div>

    <div>
      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg sm:text-2xl font-black text-gray-900 leading-none">৳{value}</span>
      </div>
      {subLabel && subLabel !== 'Title: -' && (
        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium truncate mt-1.5 sm:mt-2">
          {subLabel}
        </p>
      )}
    </div>
  </div>
);

export const SummaryGrid = ({ stats }: SummaryGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 w-full">
      <StatItem
        label="Total Deposits"
        value={stats.totalDeposits.toLocaleString()}
        icon={Wallet}
        color="emerald"
      />

      <StatItem
        label="Total Spent"
        value={stats.totalExpenses.toLocaleString()}
        icon={Receipt}
        color="rose"
      />

      <StatItem
        label="Remaining Fund"
        value={stats.remaining.toLocaleString()}
        icon={Coins}
        color="blue"
      />

      <StatItem
        label="Cost Per Person"
        value={Math.round(stats.avgCost).toLocaleString()}
        icon={Users}
        color="purple"
      />
    </div>
  );
};