import { useState, useRef, useEffect } from "react";

export function Slider({ 
  defaultValue = 100,
  value = null,
  max = 100, 
  min = 0,
  step = 1,
  className = "",
  onValueChange
}) {
  const [sliderValue, setSliderValue] = useState(value ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (value !== null) {
      setSliderValue(value);
    }
  }, [value]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round(percentage * (max - min) + min);
    setSliderValue(newValue);
    onValueChange?.(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const percentage = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div 
      ref={sliderRef}
      className={`relative h-1 group rounded-full bg-gray-600 cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="absolute h-full bg-white rounded-full group-hover:bg-green-500 transition-colors"
        style={{ width: `${percentage}%` }}
      />
      <div 
        className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${percentage}%`, top: '50%' }}
      />
    </div>
  );
}
