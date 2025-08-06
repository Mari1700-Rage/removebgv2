import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  label
}) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <div className="flex justify-between">
          <label className="text-sm font-medium">{label}</label>
          <span className="text-sm text-gray-500">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
};

export default Slider; 