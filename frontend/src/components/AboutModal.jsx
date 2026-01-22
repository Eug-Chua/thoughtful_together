import React from 'react';

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4 py-6"
      onClick={handleBackdropClick}
    >
      {/* Outer wrapper with gradient border - doesn't scroll */}
      <div className="glass-card gradient-border rounded-2xl max-w-md w-full max-h-[85vh] animate-fade-in relative flex flex-col">
        {/* Close button - stays fixed */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all duration-200 flex items-center justify-center text-lg"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Scrollable content area */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="space-y-5 text-text-primary">
            {/* Header with gradient text */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Made for the curious
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm italic">
                Same question. Different minds. Deeper conversation.
              </p>
            </div>

            {/* What Makes This Different */}
            <div className="space-y-3">
              <p className="text-center text-sm sm:text-base">
                You're not like everyone else. Neither is the person you're talking to.
              </p>

              {/* Feature list */}
              <div className="space-y-1.5 text-xs sm:text-sm text-center">
                <p>
                  <span className="font-medium bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">MBTI</span>
                  <span className="text-text-secondary"> — shapes how you process and express</span>
                </p>
                <p>
                  <span className="font-medium bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Enneagram</span>
                  <span className="text-text-secondary"> — reveals what drives you underneath</span>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary text-center">
                The result? Questions that actually land.
              </p>
            </div>

            {/* Invitation - with subtle gradient divider */}
            <div className="pt-3 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <p className="text-xs sm:text-sm text-text-secondary text-center">
                For people who want more than surface-level.
              </p>
              <p className="text-center mt-3 text-sm sm:text-base font-medium bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to skip the small talk?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;