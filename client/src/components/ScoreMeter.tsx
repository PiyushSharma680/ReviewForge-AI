'use client';

import React from 'react';

interface ScoreMeterProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({ score, label, size = 'md' }) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400 stroke-emerald-500';
    if (val >= 70) return 'text-amber-400 stroke-amber-500';
    return 'text-red-400 stroke-red-500';
  };

  const dimensions = {
    sm: { circleSize: 48, radius: 18, stroke: 4, text: 'text-xs' },
    md: { circleSize: 72, radius: 28, stroke: 5, text: 'text-lg font-bold' },
    lg: { circleSize: 96, radius: 38, stroke: 6, text: 'text-2xl font-extrabold' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" width={dimensions.circleSize} height={dimensions.circleSize}>
          <circle
            cx={dimensions.circleSize / 2}
            cy={dimensions.circleSize / 2}
            r={dimensions.radius}
            className="stroke-gray-800"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          <circle
            cx={dimensions.circleSize / 2}
            cy={dimensions.circleSize / 2}
            r={dimensions.radius}
            className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={`absolute ${dimensions.text} text-white`}>{score}</span>
      </div>
      <span className="text-xs text-gray-400 mt-1.5 font-medium">{label}</span>
    </div>
  );
};
