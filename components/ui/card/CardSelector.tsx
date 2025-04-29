'use client';

import React, { useState } from 'react';
import { CardType } from '@/lib/types';
import CreditCard from './CreditCard';

interface CardSelectorProps {
  cards: CardType[];
  activeCardId: string;
  onCardChange: (cardId: string) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ cards, activeCardId, onCardChange }) => {
  const [currentIndex, setCurrentIndex] = useState(
    cards.findIndex(card => card.id === activeCardId) || 0
  );

  const handleCardChange = (index: number) => {
    setCurrentIndex(index);
    onCardChange(cards[index].id);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        {/* Current card */}
        <div className="transition-all duration-300 ease-in-out">
          <CreditCard card={cards[currentIndex]} />
        </div>
        
        {/* Card indicators */}
        {cards.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {cards.map((card, index) => (
              <button
                key={card.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-gray-600'
                }`}
                onClick={() => handleCardChange(index)}
                aria-label={`Select card ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSelector;

