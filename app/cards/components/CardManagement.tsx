"use client";

import React, { useState, useEffect, useCallback } from "react";
import { animated, useSprings, config } from "react-spring";
import { useDrag } from "@use-gesture/react";
import Icon from "@/components/ui/icons/Icon";
import { ArrowLeft } from "lucide-react";

type Card = {
  id: number;
  name: string;
  brand: string;
  number: string;
  validThru: string;
  cvv: string;
  color: string;
};

type Action = {
  icon: string;
  label: string;
  type: string;
};

// Card data
const initialCards: Card[] = [
  { id: 1, name: "John Smith", brand: "BANK", number: "xxxx xxxx xxxx 5678", validThru: "12/25", cvv: "xxx", color: "#5B69FF" },
  { id: 2, name: "John Smith", brand: "BANK", number: "xxxx xxxx xxxx 9012", validThru: "10/24", cvv: "xxx", color: "#7B61FF" },
  { id: 3, name: "John Smith", brand: "BANK", number: "xxxx xxxx xxxx 3456", validThru: "08/26", cvv: "xxx", color: "#9A58FF" },
];

const CardManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const [orderNewCard, setOrderNewCard] = useState(false);
  const [cards, setCards] = useState<Card[]>(initialCards);

  // Action list
  const actions: Action[] = [
    { icon: "clock", label: "Set Limits", type: "link" },
    { icon: "grid", label: "Transaction History", type: "link" },
    { icon: "credit-card", label: "Manage PIN", type: "link" },
    { icon: "phone", label: "Contact/Request", type: "link" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Animation for all cards
  const [springs, api] = useSprings(cards.length, (i) => ({
    y: i * -15,
    scale: Math.max(0.85, 1 - i * 0.05),
    rot: i === 0 ? 0 : -8 + i * 4,
    opacity: Math.max(0.6, 1 - i * 0.15),
    config: config.stiff,
  }));

  const handleCardRemoved = useCallback(() => {
    api.start(i => {
      if (i === 0) {
        return {
          y: 700,
          opacity: 0,
          onRest: () => {
            setCards(c => (c.length > 1 ? c.slice(1) : initialCards));
          }
        };
      }
      return {
        y: (i - 1) * -15,
        scale: Math.max(0.85, 1 - (i - 1) * 0.05),
        rot: i === 1 ? 0 : -8 + (i - 1) * 4,
        opacity: Math.max(0.6, 1 - (i - 1) * 0.15),
      };
    });
  }, [api]);

  // Drag gesture for top card
  const bind = useDrag((state) => {
    console.log('Drag state:', state);
    const { active, movement: [mx, my], velocity, direction } = state;
    const yVelocity = Math.abs(velocity[1]);
    if (active) {
      api.start(i => {
        if (i === 0) {
          return {
            y: my,
            rot: my / 10,
            immediate: true,
          };
        }
        return {};
      });
    } else {
      if ((direction[1] > 0 && (yVelocity > 1.5 || my > 200)) || 
          (direction[1] < 0 && (yVelocity > 1.5 || my < -200))) {
        handleCardRemoved();
      } else {
        api.start(i => {
          if (i === 0) {
            return { y: 0, rot: 0 };
          }
          return {};
        });
      }
    }
  }, {
    filterTaps: false,
    bounds: { top: -200, bottom: 200, left: -200, right: 200 },
    rubberband: 0.3,
    pointer: { touch: true, mouse: true },
    axis: 'y',
    threshold: 10,
    preventDefault: true
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-pulse">Loading card management...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-8 relative z-10">
      {/* Header */}
      <div className="flex items-center px-5 pt-8 pb-6 max-w-md mx-auto">
        <button className="mr-3 p-1 rounded hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight">Card Management</h1>
      </div>

      <div className="px-5 max-w-md mx-auto">
        {/* Card Stack */}
        <div className="mb-8" style={{ height: '220px', position: 'relative', perspective: '1000px' }}>
          {springs.map(({ y, scale, rot, opacity }, i) => {
            const card = cards[i];
            return (
              <animated.div
                key={card.id}
                style={{
                  backgroundColor: card.color,
                  color: 'white',
                  transform: y.to(y => `translateY(${y}px) scale(${scale}) rotateX(${rot}deg)`),
                  transformStyle: 'preserve-3d',
                  zIndex: cards.length - i,
                  opacity,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '16px',
                  userSelect: 'none',
                  touchAction: 'pan-y',
                }}
                {...(i === 0 ? bind() : {})}
              >
                <div className="card-header">
                  <span className="card-holder">{card.name}</span>
                  <span className="card-brand">{card.brand}</span>
                </div>
                <div className="card-number">{card.number}</div>
                <div className="card-footer">
                  <div className="card-valid">
                    <span className="label">VALID</span>
                    <span className="value">{card.validThru}</span>
                  </div>
                  <div className="card-cvv">
                    <span className="label">CVV</span>
                    <span className="value">{card.cvv}</span>
                  </div>
                  <div className="card-network">
                    <div className="mastercard-logo">
                      <div className="circle circle-red" />
                      <div className="circle circle-yellow" />
                    </div>
                  </div>
                </div>
              </animated.div>
            );
          })}
        </div>

        {/* Action List */}
        <div className="bg-transparent rounded-xl divide-y divide-neutral-800">
          {/* Freeze Card */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-lg mr-4">
                <Icon name="snowflake" className="w-5 h-5 text-neutral-300" />
              </div>
              <span className="text-base">Freeze Card</span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={isFrozen}
                onChange={() => setIsFrozen((v) => !v)}
              />
              <span
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  isFrozen ? "bg-blue-600" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform ${
                    isFrozen ? "translate-x-4" : ""
                  }`}
                />
              </span>
            </label>
          </div>

          {/* Other Actions */}
          {actions.map((action, idx) => (
            <div
              key={action.label}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-lg mr-4">
                  <Icon name={action.icon} className="w-5 h-5 text-neutral-300" />
                </div>
                <span className="text-base">{action.label}</span>
              </div>
              <span>
                <Icon name="chevron-right" className="w-5 h-5 text-neutral-500" />
              </span>
            </div>
          ))}

          {/* Order New Card */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-lg mr-4">
                <Icon name="contactless" className="w-5 h-5 text-neutral-300" />
              </div>
              <span className="text-base">Order New Card</span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={orderNewCard}
                onChange={() => setOrderNewCard((v) => !v)}
              />
              <span
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  orderNewCard ? "bg-blue-600" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform ${
                    orderNewCard ? "translate-x-4" : ""
                  }`}
                />
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardManagement;
