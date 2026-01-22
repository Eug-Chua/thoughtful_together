import React, { useState } from 'react';
import { imagineQuestions } from '../questions';

const topics = [
  { key: 'personality', label: 'Personality' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'potential', label: 'Potential' },
  { key: 'adventures', label: 'Adventures' },
  { key: 'understanding', label: 'Understanding' },
  { key: 'impact', label: 'Impact' }
];

const depths = [
  { key: 'chill', label: 'Casual' },
  { key: 'deep', label: 'Deep' },
  { key: 'trust', label: 'Trust' }
];

function ImagineModal({ isOpen, onClose, onSelect }) {
  const [selectedTopic, setSelectedTopic] = useState('personality');
  const [selectedDepth, setSelectedDepth] = useState('chill');

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGenerate = () => {
    const topicQuestions = imagineQuestions[selectedTopic] || [];
    const filtered = topicQuestions.filter(q => q.depth === selectedDepth);

    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      onSelect(filtered[randomIndex].content);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4 py-6"
      onClick={handleBackdropClick}
    >
      <div className="glass-card gradient-border rounded-2xl max-w-sm w-full animate-fade-in relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all duration-200 flex items-center justify-center text-lg"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Pick your scenario
            </h2>
          </div>

          {/* Topic selection */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-text-secondary text-center">Topic</p>
            <div className="flex flex-wrap justify-center gap-2">
              {topics.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedTopic(key)}
                  className={`bounce-click px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedTopic === key
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                      : 'bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/15'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Depth selection */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-text-secondary text-center">Depth</p>
            <div className="flex justify-center gap-2">
              {depths.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedDepth(key)}
                  className={`bounce-click px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedDepth === key
                      ? 'bg-white text-black'
                      : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="bounce-click w-full py-3 rounded-full font-medium text-sm btn-twinkle text-white"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagineModal;
