import React, { useState, useEffect } from 'react';

// Animated Enneagram icon component - circle with 9 points and random number
function EnneagramIcon() {
  const size = 40;
  const center = size / 2;
  const radius = 14;
  const [number, setNumber] = useState(5);
  const [blinking, setBlinking] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start blink (fade out)
      setBlinking(true);

      // Change number after fade out completes
      setTimeout(() => {
        setNumber(Math.floor(Math.random() * 9) + 1);
        setBlinking(false);
        setBouncing(true);

        // Remove bounce after animation
        setTimeout(() => setBouncing(false), 250);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(34, 211, 238, 0.4)"
          strokeWidth="1.5"
        />
        {/* 9 points around the circle */}
        {[...Array(9)].map((_, i) => {
          const angle = (i * 40 - 90) * (Math.PI / 180);
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="rgba(34, 211, 238, 0.7)"
            />
          );
        })}
      </svg>
      {/* Center number */}
      <span
        className="absolute inset-0 flex items-center justify-center text-cyan-400 font-semibold text-sm transition-all duration-400 ease-in-out"
        style={{
          opacity: blinking ? 0 : 1,
          transform: bouncing ? 'scale(1.3)' : 'scale(1)'
        }}
      >
        {number}
      </span>
    </div>
  );
}

// Animated MBTI letters component
function AnimatedMBTI() {
  const pairs = [['E', 'I'], ['N', 'S'], ['T', 'F'], ['J', 'P']];
  const [letters, setLetters] = useState(['E', 'N', 'T', 'J']);
  const [blinking, setBlinking] = useState([false, false, false, false]);
  const [bouncing, setBouncing] = useState([false, false, false, false]);

  useEffect(() => {
    // Staggered intervals for each letter position
    const intervals = pairs.map((pair, index) => {
      const delay = 2200 + (index * 600); // Stagger the timing
      return setInterval(() => {
        // Start blink (fade out)
        setBlinking(prev => {
          const newBlink = [...prev];
          newBlink[index] = true;
          return newBlink;
        });

        // Change letter and fade back in after fade out completes
        setTimeout(() => {
          setLetters(prev => {
            const newLetters = [...prev];
            newLetters[index] = pair[Math.floor(Math.random() * 2)];
            return newLetters;
          });
          setBlinking(prev => {
            const newBlink = [...prev];
            newBlink[index] = false;
            return newBlink;
          });
          setBouncing(prev => {
            const newBounce = [...prev];
            newBounce[index] = true;
            return newBounce;
          });

          // Remove bounce after animation
          setTimeout(() => {
            setBouncing(prev => {
              const newBounce = [...prev];
              newBounce[index] = false;
              return newBounce;
            });
          }, 250);
        }, 400);
      }, delay);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  // Colors matching the game: E,N,T,J = magenta, I,S,F,P = purple
  const getColor = (letter) => {
    return ['E', 'N', 'T', 'J'].includes(letter) ? '#8F0177' : '#5B23FF';
  };

  return (
    <div className="flex gap-1">
      {letters.map((letter, i) => (
        <div
          key={i}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm transition-colors duration-300"
          style={{ backgroundColor: getColor(letter) }}
        >
          <span
            className="transition-all duration-400 ease-in-out"
            style={{
              opacity: blinking[i] ? 0 : 1,
              transform: bouncing[i] ? 'scale(1.3)' : 'scale(1)'
            }}
          >
            {letter}
          </span>
        </div>
      ))}
    </div>
  );
}

function StartPage({ onBegin, onHowToPlay }) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col relative px-4 py-4 overflow-hidden">
      {/* Background orbs - same as App.js */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
      </div>

      {/* Grain overlay */}
      <div className="grain-overlay"></div>

      {/* Main content - centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8 w-full">

        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-light tracking-wide bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Thoughtful Together
          </h1>
        </div>

        {/* Personality type icons section */}
        <div className="glass-card gradient-border rounded-2xl p-6 space-y-5 w-full animate-fade-in">
          {/* MBTI Icon - Animated */}
          <div className="flex items-center justify-center gap-4">
            <AnimatedMBTI />
            <span className="text-text-secondary text-sm">MBTI</span>
          </div>

          {/* Enneagram Icon */}
          <div className="flex items-center justify-center gap-4">
            <EnneagramIcon />
            <span className="text-text-secondary text-sm">Enneagram</span>
          </div>

          {/* Tagline */}
          <p className="text-text-primary text-sm font-medium pt-2">
            Your personality type isn't just a fun fact.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Use your MBTI and Enneagram to unlock deeper conversations.
          </p>

          {/* Subtle note about optional personalization */}
          <p className="text-text-secondary/60 text-xs italic pt-1">
            Works great even without them.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          {/* Test links */}
          <div className="flex gap-2">
            <a
              href="https://www.16personalities.com/free-personality-test"
              target="_blank"
              rel="noopener noreferrer"
              className="bounce-click flex-1 py-2.5 rounded-full font-medium text-xs bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 text-center"
            >
              Take MBTI Test
            </a>
            <a
              href="https://www.truity.com/test/enneagram-personality-test"
              target="_blank"
              rel="noopener noreferrer"
              className="bounce-click flex-1 py-2.5 rounded-full font-medium text-xs bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 text-center"
            >
              Take Enneagram Test
            </a>
          </div>

          {/* Primary CTA with glimmer effect */}
          <button
            onClick={onBegin}
            className="bounce-click w-full py-3 rounded-full font-medium text-sm bg-white text-black hover:bg-gray-200 transition-all duration-200 relative overflow-hidden"
          >
            <span className="relative z-10">I know my type</span>
            {/* Glimmer effect - uses a light silver sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/40 to-transparent animate-glimmer" />
          </button>

          {/* How to Play */}
          <button
            onClick={onHowToPlay}
            className="bounce-click w-full py-2.5 rounded-full font-medium text-xs bg-transparent text-text-secondary hover:text-text-primary transition-all duration-200"
          >
            How to Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
