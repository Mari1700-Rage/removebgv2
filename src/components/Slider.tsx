import React, { useState, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

const colors = ['#3b82f6', '#ef4444']; // Blue and Red

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  label,
}) => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    setColorIndex((prev) => (prev === 0 ? 1 : 0));
  }, [value]);

  const percentage = ((value - min) / (max - min)) * 100;

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
        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-colors duration-500"
        style={{
          background: `linear-gradient(to right, ${colors[colorIndex]} 0%, ${colors[colorIndex]} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
      <style jsx>{`
        input[type='range'] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: ${colors[colorIndex]};
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          transition: background-color 0.5s ease;
          margin-top: -8px; /* centers the thumb on the track */
        }
        input[type='range']:focus {
          outline: none;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: ${colors[colorIndex]};
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          transition: background-color 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default Slider;
