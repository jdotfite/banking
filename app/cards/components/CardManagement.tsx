"use client";

import React, { useState, useEffect, useRef } from "react";
import { animated, useSpring, config } from "react-spring";
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
  const [removing, setRemoving] = useState(false);

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

  // Animation for the top card
  const [{ y, scale }, api] = useSpring(() => ({
    y: 0,
    scale: 1,
    config: config.stiff,
  }));

  // Drag state refs
  const dragging = useRef(false);
  const startY = useRef(0);

  // Touch/mouse event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (removing) return;
    dragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || removing) return;
    const offsetY = e.touches[0].clientY - startY.current;
    if (offsetY < 0) return; // Only allow downward swipe
    api.start({ y: offsetY, immediate: true });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragging.current || removing) return;
    dragging.current = false;
    const offsetY = Math.min(220, e.changedTouches[0].clientY - startY.current);
    api.start({ 
      y: offsetY,
      scale: 1 - offsetY/150,
      immediate: true 
    });
    if (offsetY > 100) {
      setRemoving(true);
      api.start({
        y: 220,
        scale: 0,
        immediate: false,
        config: { tension: 300, friction: 30 }
      });
      setTimeout(() => {
        setCards((c) => {
          const [first, ...rest] = c;
          return [...rest, first];
        });
        api.start({ y: 0, scale: 1, immediate: true });
        setRemoving(false);
      }, 300);
    } else {
      api.start({ y: 0, scale: 1, immediate: false });
    }
  };

  // Mouse events for desktop
  const mouseDragging = useRef(false);
  const mouseStartY = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (removing) return;
    mouseDragging.current = true;
    mouseStartY.current = e.clientY;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!mouseDragging.current || removing) return;
    const offsetY = e.clientY - mouseStartY.current;
    if (offsetY < 0) return;
    api.start({ y: offsetY, immediate: true });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!mouseDragging.current || removing) return;
    mouseDragging.current = false;
    const offsetY = Math.min(220, e.clientY - mouseStartY.current);
    api.start({ 
      y: offsetY,
      scale: 1 - offsetY/150,
      immediate: true 
    });
    if (offsetY > 100) {
      setRemoving(true);
      api.start({
        y: 220,
        scale: 0,
        immediate: false,
        config: { tension: 300, friction: 30 }
      });
      setTimeout(() => {
        setCards((c) => {
          const [first, ...rest] = c;
          return [...rest, first];
        });
        api.start({ y: 0, scale: 1, immediate: true });
        setRemoving(false);
      }, 300);
    } else {
      api.start({ y: 0, scale: 1, immediate: false });
    }
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

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
          {cards.map((card, i) => {
            const isTopCard = i === 0;
            return (
              <animated.div
                key={card.id}
                style={{
                  backgroundColor: card.color,
                  color: 'white',
                  transform: isTopCard
                    ? y.to(yVal => `translateY(${yVal}px) scale(${1 - yVal/150})`)
                    : `translateY(${-15 * i}px) scale(${Math.max(0.85, 1 - i * 0.05)})`,
                  zIndex: cards.length - i,
                  opacity: Math.max(0.6, 1 - i * 0.15),
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '16px',
                  userSelect: 'none',
                  touchAction: 'none',
                  transformStyle: 'preserve-3d',
                  transition: isTopCard ? 'none' : 'top 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                }}
                onTouchStart={isTopCard ? handleTouchStart : undefined}
                onTouchMove={isTopCard ? handleTouchMove : undefined}
                onTouchEnd={isTopCard ? handleTouchEnd : undefined}
                onMouseDown={isTopCard ? handleMouseDown : undefined}
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
