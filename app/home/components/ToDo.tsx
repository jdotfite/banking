'use client';

import React, { useState } from 'react';
import { animated, SpringValue } from 'react-spring';
import { useBankingData } from '@/components/context/BankingDataProvider';
import { Check, Circle, ChevronRight, ChevronDown } from 'lucide-react';

interface ToDoProps {
  style?: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
}

const ToDo: React.FC<ToDoProps> = ({ style }) => {
  const { userData } = useBankingData();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get todo data for current user
  const todoData = userData?.todoItems || {
    completedCount: 1,
    totalCount: 4,
    items: [
      { id: '1', title: 'Activate your card', completed: true },
      { id: '2', title: 'Add to Apple Wallet', completed: false },
      { id: '3', title: 'Set up PIN', completed: false },
      { id: '4', title: 'Enable alerts', completed: false }
    ]
  };
  const completionPercentage = Math.round((todoData.completedCount / todoData.totalCount) * 100);
  // SVG Circle properties for progress chart
  const radius = 35; // Smaller radius for the compact chart
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;  return (
    <animated.div style={style} className="mb-4">
      {/* Custom purple background */}
      <div className="rounded-lg p-4 relative overflow-hidden" style={{ backgroundColor: '#2c2044' }}>{/* Progress Chart - Top Right */}
        <div className="absolute top-4 right-4 flex items-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 86 86">
              {/* Background circle */}
              <circle
                cx="43"
                cy="43"
                r={radius}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="43"
                cy="43"
                r={radius}
                stroke="#2baa72"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
            {/* Percentage text in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{completionPercentage}%</span>
            </div>
          </div>
        </div>        {/* Title and description with expand button */}
        <div 
          className="pr-20 cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <div className="mr-2 opacity-60 group-hover:opacity-100 transition-opacity flex items-center">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-white font-medium leading-none group-hover:text-white/90 transition-colors">
                  To-Do
                </h3>
                <p className="text-white/80 text-xs leading-tight mt-1 group-hover:text-white/70 transition-colors">
                  Complete your tasks to earn rewards!
                </p>
              </div>
            </div>
          </div>
        </div>        {/* Todo items - Stacked vertically */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out mt-2 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-2 pt-3 border-t border-white/10">
            {todoData.items.map((item: any) => (
              <div 
                key={item.id} 
                className={`flex items-center group transition-all duration-200 ${
                  !item.completed 
                    ? 'hover:bg-white/10 hover:scale-[1.02] cursor-pointer rounded-lg p-1 -m-1' 
                    : 'cursor-default'
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the expand/collapse
                  if (!item.completed) {
                    console.log(`Clicked on task: ${item.title}`);
                    // Future: Navigate to specific setup page
                  }
                }}
              >

                {item.completed ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#2baa72' }}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className={`w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0 transition-all duration-200 ${
                    'border-purple-300 group-hover:border-white group-hover:bg-white/10'
                  }`}></div>
                )}
                <span 
                  className={`text-xs transition-all duration-200 ${
                    item.completed 
                      ? 'text-white/60 line-through' 
                      : 'text-white group-hover:text-white group-hover:font-medium'
                  }`}
                >
                  {item.title}
                </span>
                
                {/* Show arrow on hover for incomplete items */}
                {!item.completed && (
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ChevronRight className="w-3 h-3 text-white/80" />
                  </div>
                )}
              </div>          ))}
          </div>
        </div>

      </div>
    </animated.div>
  );
};

export default ToDo;
