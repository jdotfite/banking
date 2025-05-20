'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CardsListView = dynamic(() => import('@/components/screens/CardsListView'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#121212] flex items-center justify-center">
    <div className="animate-pulse">Loading cards...</div>
  </div>
});

export default function CardsPage() {
  return <CardsListView />;
}
