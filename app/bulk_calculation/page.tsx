import React, { Suspense } from 'react';
import BulkCalculation from '../components/BulkCalculation';

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-medium tracking-widest uppercase text-xs">Loading Calculator...</div>}>
      <BulkCalculation />
    </Suspense>
  );
}