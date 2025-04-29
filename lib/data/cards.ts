import { CardType } from '../types';

export const cards: CardType[] = [
  {
    id: '1',
    type: 'VISA',
    number: '•••• 9891',
    expiry: '••/••',
    cvv: '•••',
    color: '#E53E3E', // Updated red color that better matches the inspiration
  },
  // You can add more cards here
];

export const getCard = (id: string): CardType | undefined => {
  return cards.find(card => card.id === id);
};

export const getDefaultCard = (): CardType => {
  return cards[0];
};
