// app/components/StatCard.tsx
import React from 'react';

export const StatCard = ({ label, value, subtext }: { label: string, value: string, subtext?: string }) => (
  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
    <div>
      <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    {subtext && <p className="text-gray-300 text-[10px] mt-1">{subtext}</p>}
  </div>
);