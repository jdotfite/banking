// components/ui/charts/SpendingChart.tsx
'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { animated, useSpring } from 'react-spring';

interface SpendingData {
  name: string;
  value: number;
  color: string;
}

interface PeriodOption {
  id: string;
  name: string;
  label: string;
}

interface SpendingChartProps {
  selectedPeriod: string;
  periodOptions: PeriodOption[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ selectedPeriod, periodOptions }) => {
  // Period-specific data with more accurate colors matching the inspiration image
  const periodData = {
    day: [
      { name: 'Shopping', value: 120, color: '#8b5cf6' }, // Purple
      { name: 'Food', value: 84, color: '#f87171' }, // Red
      { name: 'Entertainment', value: 65, color: '#60a5fa' }, // Blue
      { name: 'Transport', value: 48, color: '#fbbf24' }, // Yellow
      { name: 'Other', value: 30, color: '#4ade80' }, // Green
    ],
    week: [
      { name: 'Shopping', value: 280, color: '#8b5cf6' },
      { name: 'Food', value: 175, color: '#f87171' },
      { name: 'Entertainment', value: 120, color: '#60a5fa' },
      { name: 'Transport', value: 95, color: '#fbbf24' },
      { name: 'Other', value: 60, color: '#4ade80' },
    ],
    month: [
      { name: 'Shopping', value: 450, color: '#8b5cf6' },
      { name: 'Food', value: 300, color: '#f87171' },
      { name: 'Entertainment', value: 250, color: '#60a5fa' },
      { name: 'Transport', value: 244, color: '#fbbf24' },
      { name: 'Other', value: 100, color: '#4ade80' },
    ],
    year: [
      { name: 'Shopping', value: 4820, color: '#8b5cf6' },
      { name: 'Food', value: 3600, color: '#f87171' },
      { name: 'Entertainment', value: 2950, color: '#60a5fa' },
      { name: 'Transport', value: 3100, color: '#fbbf24' },
      { name: 'Other', value: 1200, color: '#4ade80' },
    ],
  };
  
  // Get data for the current period
  const data = periodData[selectedPeriod as keyof typeof periodData];
  
  // Calculate total spent
  const totalSpent = data.reduce((sum, item) => sum + item.value, 0);
  
  // Format as currency
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Get the label for the current period
  const getPeriodLabel = () => {
    const option = periodOptions.find(p => p.id === selectedPeriod);
    return option ? option.label : 'this month';
  };

  // Add animation for chart
  const chartAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 25 },
  });

  return (
    <animated.div className="w-full" style={chartAnimation}>
      {/* Chart container - reduced thickness to match inspiration better */}
      <div className="relative" style={{ height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={95}
              outerRadius={115}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
              paddingAngle={5} // Increased spacing between segments
            >
              {data.map((entry, index) => (
                // Using type assertion to bypass TypeScript's type checking
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  strokeWidth={0}
                  {...({ cornerRadius: 6 } as any)} // Type assertion to bypass TypeScript check
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centered text overlay - adjusted font size */}
        <div className="absolute flex flex-col items-center justify-center inset-0 pointer-events-none">
          <p className="text-gray-400 mb-1" style={{ fontSize: '15px' }}>Spent {getPeriodLabel()}</p>
          <p className="text-white font-semibold" style={{ fontSize: '36px' }}>{formatCurrency(totalSpent)}</p>
        </div>
      </div>
    </animated.div>
  );
};

export default SpendingChart;