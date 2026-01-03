// components/SummaryGrid.tsx
import React from 'react';
import { Wallet, Receipt, Coins, Users, LucideIcon } from "lucide-react";

interface SummaryGridProps {
  stats: {
    totalDeposits: number;
    totalExpenses: number;
    remaining: number;
    avgCost: number;
  };
}

// Internal Stat Card Component
const StatItem = ({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg
}: {
  label: string;
  value: string;
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
      <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
        ৳{value}
      </p>
    </div>
  </div>
);

export const SummaryGrid = ({ stats }: SummaryGridProps) => {
  return (
    // MODERN CONTAINER
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
      <h3 className="text-lg font-bold text-gray-800 mb-5">Trip Summary</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Deposits (Emerald) */}
        <StatItem
          label="Total Deposits"
          value={stats.totalDeposits.toLocaleString()}
          icon={Wallet}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />

        {/* Total Expenses (Rose) */}
        <StatItem
          label="Total Spent"
          value={stats.totalExpenses.toLocaleString()}
          icon={Receipt}
          iconColor="text-rose-600"
          iconBg="bg-rose-100"
        />

        {/* Remaining Fund (Blue) - CHANGED ICON TO COINS */}
        <StatItem
          label="Remaining"
          value={stats.remaining.toLocaleString()}
          icon={Coins}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />

        {/* Avg Cost (Purple) */}
        <StatItem
          label="Average Cost"
          value={Math.round(stats.avgCost).toLocaleString()}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>
    </div>
  );
};