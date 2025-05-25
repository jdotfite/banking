'use client';

import React from 'react';

interface TestCardsViewProps {
  selectedCardId?: string | null;
}

const TestCardsView: React.FC<TestCardsViewProps> = ({ selectedCardId }) => {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Test Cards View</h1>
      <p>This is a simple test component to verify the routing works.</p>
      {selectedCardId && (
        <p className="mt-4 p-4 bg-green-600 rounded">
          Selected card ID: {selectedCardId}
        </p>
      )}
      <div className="mt-8 p-4 bg-neutral-800 rounded">
        <h2 className="text-lg font-bold mb-2">Routing Test</h2>
        <p>If you can see this, the component is loading correctly!</p>
      </div>
    </div>
  );
};

export default TestCardsView;
