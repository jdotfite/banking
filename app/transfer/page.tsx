'use client';

import React from 'react';
import BottomNav from '@/components/ui/navigation/BottomNav';

export default function TransferPage() {
  return (
    <main className="relative min-h-screen">
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <h1 className="text-2xl font-bold">Transfer</h1>
      </div>
      <BottomNav />
    </main>
  );
}
