
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface StatBarProps {
  name: string;
  value: number;
  max?: number;
  maxValue?: number;
  color?: string;
  showValue?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onAllocate?: () => void;
  canAllocate?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({
  name,
  value,
  max,
  maxValue,
  color = 'bg-sl-blue',
  showValue = true,
  className = '',
  icon,
  onAllocate,
  canAllocate = false,
}) => {
  const maxVal = max || maxValue || 100;
  const percentage = Math.min(100, Math.max(0, (value / maxVal) * 100));

  const getColorClass = (colorProp: string) => {
    const colorMap: { [key: string]: string } = {
      'red': 'bg-red-500',
      'green': 'bg-green-500', 
      'blue': 'bg-blue-500',
      'purple': 'bg-purple-500',
      'yellow': 'bg-yellow-500',
      'orange': 'bg-orange-500',
    };
    return colorMap[colorProp] || colorProp;
  };

  return (
    <div className={`w-full mb-3 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-slate-300">{icon}</span>}
          <span className="text-sm text-slate-300">{name}</span>
        </div>
        <div className="flex items-center space-x-2">
          {showValue && (
            <span className="text-sm text-slate-300">
              {value} / {maxVal}
            </span>
          )}
          {onAllocate && canAllocate && (
            <Button
              onClick={onAllocate}
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 border-sl-blue text-sl-blue hover:bg-sl-blue hover:text-white"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="h-2 w-full bg-sl-grey-dark rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full ${getColorClass(color)} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
