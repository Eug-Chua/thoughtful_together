import React, { useState, useEffect } from 'react';
import TunerKnob from './TunerKnob';
import questions from './questions';
import './index.css';

// Typing animation component for questions
function Typewriter({ text, speed = 35 }) {
  const [displayed, setDisplayed] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayed('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayed}<span className="animate-pulse">|</span></span>;
}

function App() {
  const [depth, setDepth] = useState('chill');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [reframed, setReframed] = useState('');
  const [mbti, setMbti] = useState(['E', 'N', 'T', 'J']);
  const [enneagram, setEnneagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [showTrustPrompt, setShowTrustPrompt] = useState(false);

  const filtered = questions.filter(q => q.depth === depth);
  const question = reframed || filtered[questionIndex]?.content || '';
  const fullMbti = Object.values(mbti).join('');

  useEffect(() => {
    let lastShake = 0;
    let previousMagnitude = 0;
    const shakeThreshold = 25;
    const shakeDeltaThreshold = 10;
    const cooldown = 2000;

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      const delta = Math.abs(magnitude - previousMagnitude);
      previousMagnitude = magnitude;

      const now = Date.now();
      if (delta > shakeDeltaThreshold && magnitude > shakeThreshold && now - lastShake > cooldown) {
        const random = Math.floor(Math.random() * filtered.length);
        setQuestionIndex(random);
        setReframed('');
        setFadeKey((prev) => prev + 1);
        lastShake = now;
      }
    };

    const enableMotion = () => {
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
      ) {
        DeviceMotionEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              window.addEventListener('devicemotion', handleMotion);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
    };

    window.addEventListener('click', enableMotion, { once: true });

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [filtered.length]);

  const pickQuestion = (offset) => {
    const newIndex = (questionIndex + offset + filtered.length) % filtered.length;
    setQuestionIndex(newIndex);
    setReframed('');
    setFadeKey(prev => prev + 1);
  };

  const reframeWithAI = async () => {
    if (!question) return;

    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mbti: fullMbti || null,
          enneagram: enneagram || null
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.reframed) throw new Error('No reframed text in response.');

      setReframed(data.reframed);
      setFadeKey(prev => prev + 1);
    } catch (err) {
      console.error('[Reframe error]', err);

      // Load fallback by MBTI and ID match
      const mbtiCode = fullMbti.toLowerCase();
      const currentQuestionId = filtered[questionIndex]?.id;

      if (mbtiCode.length === 4 && currentQuestionId) {
        try {
          const fallbackUrl = `/fallback_questions/fallback_questions_json/${mbtiCode}_fallback.json`;
          const fallbackRes = await fetch(fallbackUrl);
          if (!fallbackRes.ok) throw new Error(`Fallback HTTP ${fallbackRes.status}`);

          const fallbackSet = await fallbackRes.json();
          const fallbackMatch = fallbackSet.find(q => q.id === currentQuestionId);

          if (fallbackMatch) {
            setReframed(fallbackMatch.content);
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch failed:', fallbackErr);
        }

        setFadeKey(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center relative px-4 overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
      </div>

      {/* Grain overlay for texture */}
      <div className="grain-overlay"></div>

      <div className="relative z-10 w-full max-w-md space-y-4 text-center">
        {/* Depth toggle tabs */}
        <div className="flex justify-center gap-2">
          {[
            { key: 'chill', label: 'Casual' },
            { key: 'deep', label: 'Deep' },
            { key: 'trust', label: 'Trust', needsPrompt: true }
          ].map(({ key, label, needsPrompt }) => (
            <button
              key={key}
              onClick={() => {
                if (needsPrompt) {
                  setShowTrustPrompt(true);
                } else {
                  setDepth(key);
                  setQuestionIndex(0);
                  setReframed('');
                }
              }}
              className={`bounce-click px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                depth === key
                  ? 'bg-white text-black'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Trust mode consent modal */}
        {showTrustPrompt && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <div className="glass-card rounded-2xl p-8 max-w-sm text-center space-y-6 animate-fade-in">
              <p className="text-text-primary text-base leading-relaxed">
                These questions invite vulnerability. They work best when you feel safe and ready to share.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowTrustPrompt(false)}
                  className="px-5 py-2.5 rounded-full bg-surface border border-border text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors"
                >
                  Not yet
                </button>
                <button
                  onClick={() => { setDepth('trust'); setQuestionIndex(0); setReframed(''); setShowTrustPrompt(false); }}
                  className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  I'm ready
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question card */}
        <div
          key={fadeKey}
          className="glass-card gradient-border rounded-xl p-5 text-base text-text-primary leading-relaxed min-h-[80px] flex items-center justify-center animate-fade-in"
        >
          <Typewriter text={question} />
        </div>

        {/* MBTI toggle buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['EI', 'NS', 'TF', 'JP'].map((pair, idx) => (
            <button
              key={pair}
              onClick={() => {
                const updated = [...mbti];
                updated[idx] = updated[idx] === pair[0] ? pair[1] : pair[0];
                setMbti(updated);
              }}
              className={`bounce-click py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                mbti[idx] === pair[0]
                  ? 'bg-[#8F0177] text-white'
                  : 'bg-[#5B23FF] text-white'
              }`}
            >
              {mbti[idx]}
            </button>
          ))}
        </div>

        {/* Enneagram knob */}
        <div className="flex items-center justify-center">
          <TunerKnob value={parseInt(enneagram || 1)} onChange={(val) => setEnneagram(val.toString())} />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {/* Reframe button with twinkle effect */}
          <button
            onClick={reframeWithAI}
            disabled={loading}
            className={`bounce-click w-full py-2.5 rounded-full font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? 'bg-surface border border-border text-text-secondary cursor-wait'
                : 'btn-twinkle text-white'
            }`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Thinking...
              </>
            ) : (
              'Reframe'
            )}
          </button>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => pickQuestion(-1)}
              className="bounce-click flex-1 py-2.5 rounded-full font-medium text-sm bg-surface border border-white/10 text-text-primary hover:bg-surface-hover hover:border-white/20 transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => pickQuestion(1)}
              className="bounce-click flex-1 py-2.5 rounded-full font-medium text-sm bg-surface border border-white/10 text-text-primary hover:bg-surface-hover hover:border-white/20 transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
