import React, { useState, useEffect } from 'react';
import TunerKnob from './TunerKnob';
import questions from './questions.json';
import './index.css';

// 💬 Typing animation component for questions
function Typewriter({ text, speed = 40 }) {
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

  return <div>{displayed}</div>;
}

function App() {
  const [depth, setDepth] = useState('chill');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [reframed, setReframed] = useState('');
  const [mbti, setMbti] = useState(['E', 'N', 'T', 'J']);
  const [enneagram, setEnneagram] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

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

  /* ----------  Reframe button handler  ---------- */
  const reframeWithAI = async () => {
    if (!question) return;      // must have a question, otherwise do nothing

    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/reframe', {
      // const res = await fetch('http://localhost:5050/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mbti: fullMbti || null,      // '' → null
          enneagram: enneagram || null // '' → null
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.reframed) throw new Error('No reframed text in response.');

      setReframed(data.reframed);
      setFadeKey(prev => prev + 1);
    } catch (err) {
      console.error('[Reframe error]', err);
      setReframed('⚠️ Failed to reframe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tealLight via-tealMid to-tealBase flex items-center justify-center relative px-6">
      {/* 🔮 Orbiting blobs — z-index 0 so they stay under content */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
        {/* <div className="orb orb--3"></div> */}
        {/* <div className="orb orb--4"></div> */}
      </div>


      <div className="relative z-10 w-full max-w-xl space-y-6 text-center">
        {/* 🔘 Depth toggle */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => { setDepth('chill'); setQuestionIndex(0); setReframed(''); }}
            className={`bounce-click px-4 py-2 rounded-full text-sm font-medium shadow-light ${
              depth === 'chill'
              ? 'bg-[#09747f] text-white'        
              : 'bg-white bg-opacity-70 text-gray-700'
            }`}
          >
            Casual
          </button>
          <button
            onClick={() => { setDepth('deep'); setQuestionIndex(0); setReframed(''); }}
            className={`bounce-click px-4 py-2 rounded-full text-sm font-medium shadow-light ${
              depth === 'deep'
              ? 'bg-[#09747f] text-white'        // dusty plum
              : 'bg-white bg-opacity-70 text-gray-700'
            }`}
          >
            Reflect
          </button>
          <button
            onClick={() => { setDepth('toty'); setQuestionIndex(0); setReframed(''); }}
            className={`bounce-click px-4 py-2 rounded-full text-sm font-medium shadow-light ${
              depth === 'toty'
                ? 'bg-[#09747f] text-white'
                : 'bg-white bg-opacity-70 text-gray-700'
            }`}
          >
            Third Day
          </button>
          <button
            onClick={() => { setDepth('sermon'); setQuestionIndex(0); setReframed(''); }}
            className={`bounce-click px-4 py-2 rounded-full text-sm font-medium shadow-light ${
              depth === 'sermon'
                ? 'bg-[#09747f] text-white'
                : 'bg-white bg-opacity-70 text-gray-700'
            }`}
          >
            Sermon
          </button>
        </div>

        {/* 🃏 Question Display with Typing */}
        <div key={fadeKey} className="bg-white bg-opacity-90 shadow-heavy rounded-lg p-6 text-lg text-gray-800 transition-opacity duration-700 animate-fade-in">
          <Typewriter text={question} />
        </div>

        {/* 🎯 MBTI Buttons */}
        <div className="grid grid-cols-4 gap-2 w-full ">
          {['EI', 'NS', 'TF', 'JP'].map((pair, idx) => (
            <button
              key={pair}
              onClick={() => {
                const updated = [...mbti];
                updated[idx] = updated[idx] === pair[0] ? pair[1] : pair[0];
                setMbti(updated);
              }}
              className={`bounce-click px-4 py-3 rounded-full text-sm font-medium w-full shadow-light transition-shadow duration-200 ${
                mbti[idx] === pair[0] 
                  ? 'bg-[#565ca9] text-white'
                  : 'bg-[#BA789D] text-white'
              }`}
              
            >
              {mbti[idx]}
            </button>
          ))}
        </div>

        {/* 🔢 Enneagram Selector */}
        {/* <div className="grid grid-cols-9 gap-1 sm:gap-2 md:gap-3 text-sm">
          {[...Array(9)].map((_, i) => (
            <button
              key={i}
              onClick={() =>
                setEnneagram(prev =>
                  prev === (i + 1).toString() ? '' : (i + 1).toString()
                )
              }  
              className={`bounce-click w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition shadow-light ${
                enneagram === (i + 1).toString()
                  ? 'bg-[#9292a0] text-white'  // Your slate blue orb
                  : 'bg-white bg-opacity-80 text-gray-800 hover:bg-white hover:bg-opacity-60'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div> */}
        
          {/* <CircularSlider
            label="Enneagram"
            min={1}
            max={9}
            data={[...Array(9)].map((_, i) => (i + 1).toString())}
            width={150}
            knobSize={30}
            knobColor="#565ca9"
            progressSize={15}
            progressColorFrom="#565ca9"
            progressColorTo="#BA789D"
            trackColor="#e5e7eb"
            labelFontSize="0.75rem"
            labelColor='white'
            valueFontSize="2rem"
            verticalOffset='1.5rem'
            appendToValue=""
            trackDraggable='true'
            
            onChange={value => setEnneagram(value)}
          /> */}
        <div className="flex items-center justify-center">
          <TunerKnob value={parseInt(enneagram || 1)} onChange={(val) => setEnneagram(val.toString())} />
        </div>



        {/* ✨ Actions */}
        <div className="flex flex-col space-y-4 text-lg">
          <button
            onClick={reframeWithAI}
            disabled={loading}
            className={`bounce-click w-full py-3 rounded-full shadow-medium transition ${
              loading 
                ? 'bg-black text-white'  // Cream background when loading
                : 'bg-[#5d4e6d] text-white hover:bg-[#76638B]'  // Saddle brown with golden tan hover
            }`}
          >
            {loading ? 'Thinking...' : 'Reframe'}
          </button>

          {/* Add spacing between AI button and nav */}
          <div className="flex justify-between space-x-2">
            <button
              onClick={() => pickQuestion(-1)}
              className="bounce-click w-full py-3 shadow-medium rounded-full text-white bg-[#343a40] hover:bg-[#495057]"
            >
              Previous
            </button>
            <button
              onClick={() => pickQuestion(1)}
              className="bounce-click w-full py-3 shadow-medium rounded-full text-white bg-[#343a40] hover:bg-[#495057]"
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
