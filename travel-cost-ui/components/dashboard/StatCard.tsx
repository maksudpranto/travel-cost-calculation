import React from 'react';

// Define what data this card accepts
interface StatCardProps {
  label: string;
  value: string;
  subtext?: string; // Optional text like "Avg = total / people"
}

export default function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
      {subtext && (
        <p className="text-gray-400 text-xs mt-1">{subtext}</p>
      )}
    </div>
  );
}