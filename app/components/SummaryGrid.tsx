import React from 'react';
import { Wallet, Receipt, Coins, Users, TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface SummaryGridProps {
  stats: {
    totalDeposits: number;
    totalExpenses: number;
    remaining: number;
    avgCost: number;
    maxCost: number;
    minCost: number;
    maxExpenseName?: string; // New Prop
    minExpenseName?: string; // New Prop
  };
}

// Internal Stat Card Component
const StatItem = ({
  label,
  value,
  subLabel, // New Optional Prop for "Title: ..."
  icon: Icon,
  iconColor,
  iconBg
}: {
  label: string;
  value: string;
  subLabel?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}) => (
  <div className="flex flex-col justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
        <Icon size={20} />
      </div>
    </div>

    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>

      {/* Main Value */}
      <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
        ৳{value}
      </p>

      {/* Sub Label (Title: Expense Name) */}
      {subLabel && subLabel !== 'Title: -' && (
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate mt-1 bg-gray-100/80 px-2 py-0.5 rounded-md inline-block max-w-full">
          {subLabel}
        </p>
      )}
    </div>
  </div>
);

export const SummaryGrid = ({ stats }: SummaryGridProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
      <h3 className="text-lg font-bold text-gray-800 mb-5">Trip Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatItem
          label="Total Deposits"
          value={stats.totalDeposits.toLocaleString()}
          icon={Wallet}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />

        <StatItem
          label="Total Spent"
          value={stats.totalExpenses.toLocaleString()}
          icon={Receipt}
          iconColor="text-rose-600"
          iconBg="bg-rose-100"
        />

        <StatItem
          label="Remaining Money"
          value={stats.remaining.toLocaleString()}
          icon={Coins}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />

        <StatItem
          label="Average Cost Per Person"
          value={Math.round(stats.avgCost).toLocaleString()}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />

        {/* MAX EXPENSE with Title */}
        <StatItem
          label="Max Expense"
          value={stats.maxCost.toLocaleString()}
          subLabel={`Expense: ${stats.maxExpenseName || '-'}`}
          icon={TrendingUp}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />

        {/* MIN EXPENSE with Title */}
        <StatItem
          label="Min Expense"
          value={stats.minCost.toLocaleString()}
          subLabel={`Expense: ${stats.minExpenseName || '-'}`}
          icon={TrendingDown}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
      </div>
    </div>
  );
};