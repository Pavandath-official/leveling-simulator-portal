
import React from 'react';

interface StatBarProps {
  name: string;
  value: number;
  max: number;
  color?: string;
  showValue?: boolean;
  className?: string;
}

const StatBar: React.FC<StatBarProps> = ({
  name,
  value,
  max,
  color = 'bg-sl-blue',
  showValue = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full mb-3 ${className}`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-slate-300">{name}</span>
        {showValue && (
          <span className="text-sm text-slate-300">
            {value} / {max}
          </span>
        )}
      </div>
      <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
