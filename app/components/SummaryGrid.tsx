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
}) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    rose: 'from-rose-500 to-rose-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color] || 'from-gray-500 to-gray-600'} p-4 sm:p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 group text-white border border-white/10`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20">
          <Icon size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-3xl font-black leading-none tracking-tight">৳{value}</span>
        </div>
        {subLabel && subLabel !== 'Title: -' && (
          <p className="text-[10px] text-white/70 font-medium truncate mt-2 border-t border-white/10 pt-2">
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
};

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
