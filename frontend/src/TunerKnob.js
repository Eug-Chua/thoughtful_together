import React, { useState, useRef, useEffect } from 'react';

const radius = 60;
const center = radius + 10;
const knobSize = 140;

function angleFromCoords(x, y, cx, cy) {
  return Math.atan2(y - cy, x - cx);
}

function TunerKnob({ value, onChange, min = 0, max = 9 }) {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef(null);
  const totalSteps = max - min + 1;
  const anglePerStep = 270 / (totalSteps - 1); // 270° sweep for tuner feel
  const startAngle = -135; // Start at 7:30 clock position

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
  
      const rect = knobRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
  
      const isTouch = e.type.startsWith('touch');
      const coords = isTouch
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };
  
      const angle = angleFromCoords(coords.x, coords.y, cx, cy) * (180 / Math.PI);
      let relativeAngle = (angle - startAngle + 360) % 360;
      if (relativeAngle > 270) relativeAngle = 270;
  
      let step = Math.round(relativeAngle / anglePerStep);
      step = Math.min(Math.max(step, 0), totalSteps - 1);
      onChange(step);
    };
  
    const handleEnd = () => {
      setIsDragging(false);
    };
  
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, anglePerStep, onChange, startAngle, totalSteps]);
  

  const pointerAngle = (startAngle + value * anglePerStep) * (Math.PI / 180);
  const pointerX = center + Math.cos(pointerAngle) * (radius - 20);
  const pointerY = center + Math.sin(pointerAngle) * (radius - 20);

  return (
    <div
      className="knob-container relative flex flex-col items-center justify-center rounded-full"
      style={{
        width: knobSize,
        height: knobSize,
        willChange: 'transform',
        WebkitTapHighlightColor: 'transparent',
      }}
      ref={knobRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#1e1e1e] to-[#2b2b2b] blur-2xl opacity-40 z-0" />
  
      {/* ⬇️ Removed drop-shadow, replaced with surrounding Tailwind styling */}
      <svg width={knobSize} height={knobSize} className="relative z-10">
        <defs>
          <radialGradient id="dialGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#595959" />
            <stop offset="100%" stopColor="#070C0F" />
          </radialGradient>
        </defs>
  
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#dialGradient)"
          stroke="#4d4d4d"
          strokeWidth="0.5"
        />
  
        {/* Dots for each step */}
        {[...Array(totalSteps)].map((_, i) => {
          const angle = (startAngle + i * anglePerStep) * (Math.PI / 180);
          const x = center + Math.cos(angle) * (radius - 10);
          const y = center + Math.sin(angle) * (radius - 10);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#e6e6e6"
              className="pointer-events-none"
            />
          );
        })}
  
        {/* Dot pointer */}
        <circle
          cx={pointerX}
          cy={pointerY}
          r="4"
          fill="#f2f2f2"
        />
      </svg>
  
      <div className="absolute bottom-[-0.8rem] text-gray-200 text-sm font-semibold opacity-90">
        Enneagram: {value === 0 ? 'None' : value}
      </div>
    </div>
  );
  
}

export default TunerKnob;
