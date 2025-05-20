'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CardDetailWithSelector from '@/app/cards/components/CardDetailWithSelector';

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params?.id as string;
  
  if (!cardId) {
    return <div className="p-4 text-red-500">Error: Missing card ID</div>;
  }
  
  return <CardDetailWithSelector cardId={cardId} />;
}
