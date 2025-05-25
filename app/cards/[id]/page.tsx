'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CardDetailWithSelector from '@/app/cards/components/CardDetailWithSelector';
import PageTemplate from '@/components/layout/PageTemplate';

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params?.id as string;
  
  if (!cardId) {
    return (
      <PageTemplate>
        <div className="p-4 text-red-500">Error: Missing card ID</div>
      </PageTemplate>
    );
  }
  
  return (
    <PageTemplate>
      <CardDetailWithSelector cardId={cardId} />
    </PageTemplate>
  );
}
