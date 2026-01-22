import React, { useState, useEffect } from 'react';

const tutorialSteps = [
  {
    target: 'depth-tabs',
    title: 'Choose Your Depth',
    description: 'Pick your vibe: Casual for light chat, Deep for meaningful exchange, Trust for vulnerable sharing, or Imagine for creative "what if" scenarios.',
    position: 'bottom'
  },
  {
    target: 'mbti-buttons',
    title: 'Set Your MBTI',
    description: 'Toggle each dimension to match your personality type. This helps personalize questions just for you.',
    position: 'bottom'
  },
  {
    target: 'enneagram-knob',
    title: 'Dial Your Enneagram',
    description: 'Turn the knob to select your Enneagram type (1-9). Combined with MBTI, this creates uniquely tailored prompts.',
    position: 'top'
  },
  {
    target: 'reframe-button',
    title: 'Reframe the Question',
    description: 'Tap here to transform the question based on your personality settings. Each reframe is unique!',
    position: 'top'
  },
  {
    target: 'nav-buttons',
    title: 'Browse Questions',
    description: 'Use these to move through the question deck. Find the perfect conversation starter.',
    position: 'top'
  }
];

function TutorialOverlay({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const updateTargetRect = () => {
      const targetId = tutorialSteps[step]?.target;
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    return () => window.removeEventListener('resize', updateTargetRect);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const currentStep = tutorialSteps[step];
  const isLastStep = step === tutorialSteps.length - 1;
  const isFirstStep = step === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setStep(s => s - 1);
    }
  };

  // Calculate tooltip position and arrow
  const getTooltipStyle = () => {
    if (!targetRect) return { opacity: 0 };

    const padding = 24;
    const tooltipWidth = 280;
    const tooltipHeight = 240;
    const extraGap = 40; // Extra gap to ensure component is fully visible

    let top, left;
    left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

    // Position based on step preference
    if (currentStep.position === 'top') {
      top = targetRect.top - padding - tooltipHeight - extraGap;
    } else {
      top = targetRect.top + targetRect.height + padding;
    }

    // Keep tooltip within viewport horizontally
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    top = Math.max(16, top);

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`
    };
  };

  // Determine if arrow should point up (tooltip below element) or down (tooltip above element)
  const isArrowOnTop = () => {
    return currentStep.position === 'bottom';
  };

  // Get arrow position relative to tooltip
  const getArrowStyle = () => {
    if (!targetRect) return {};

    const tooltipWidth = 280;
    const targetCenter = targetRect.left + targetRect.width / 2;
    const tooltipLeft = Math.max(16, Math.min(
      targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
      window.innerWidth - tooltipWidth - 16
    ));

    // Arrow position relative to tooltip
    const arrowLeft = Math.max(20, Math.min(targetCenter - tooltipLeft, tooltipWidth - 20));

    return {
      left: `${arrowLeft}px`
    };
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border glow */}
      {targetRect && (
        <div
          className="absolute rounded-2xl pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5), 0 0 24px rgba(139, 92, 246, 0.4)',
            zIndex: 51
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute animate-fade-in"
        style={{
          ...getTooltipStyle(),
          zIndex: 52
        }}
      >
        {/* Arrow pointing to element */}
        <div
          className="absolute w-4 h-4 transform rotate-45"
          style={{
            ...getArrowStyle(),
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(23, 23, 23, 0.9))',
            ...(isArrowOnTop()
              ? { top: '-8px' }
              : { bottom: '-8px' }
            ),
            marginLeft: '-8px',
            borderRadius: '2px'
          }}
        />

        {/* Card content */}
        <div
          className="relative rounded-3xl p-5"
          style={{
            background: 'rgba(23, 23, 23, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
          }}
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-light text-violet-400/80">
              {step + 1} of {tutorialSteps.length}
            </span>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/70 text-xs font-light transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Content */}
          <h3 className="text-white font-medium text-base mb-2">{currentStep.title}</h3>
          <p className="text-white/60 text-sm font-light leading-relaxed mb-5">{currentStep.description}</p>

          {/* Navigation */}
          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex-1 px-4 py-2.5 rounded-full text-sm font-light text-white/60 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-400 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/25"
            >
              {isLastStep ? 'Got it!' : 'Next'}
            </button>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-4">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-4 bg-violet-400'
                    : 'w-1 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialOverlay;
